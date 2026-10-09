import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
})

export const query = (text, params) => pool.query(text, params)

// Supabase-compatible wrapper so all existing API routes work unchanged
function buildClient() {
  return {
    from(table) {
      return new QueryBuilder(table)
    }
  }
}

class QueryBuilder {
  constructor(table) {
    this._table = table
    this._select = '*'
    this._wheres = []
    this._whereValues = []
    this._insertData = null
    this._updateData = null
    this._deleteFlag = false
    this._single = false
    this._limit = null
    this._order = null
    this._orderAsc = true
  }

  select(cols = '*') {
    this._select = cols
    return this
  }

  insert(data) {
    this._insertData = Array.isArray(data) ? data : [data]
    return this
  }

  update(data) {
    this._updateData = data
    return this
  }

  delete() {
    this._deleteFlag = true
    return this
  }

  eq(col, val) {
    this._wheres.push(`${col} = $${this._wheres.length + 1}`)
    this._whereValues.push(val)
    return this
  }

  neq(col, val) {
    this._wheres.push(`${col} != $${this._wheres.length + 1}`)
    this._whereValues.push(val)
    return this
  }

  in(col, vals) {
    const placeholders = vals.map((_, i) => `$${this._wheres.length + i + 1}`).join(', ')
    this._wheres.push(`${col} IN (${placeholders})`)
    this._whereValues.push(...vals)
    return this
  }

  lt(col, val) {
    this._wheres.push(`${col} < $${this._wheres.length + 1}`)
    this._whereValues.push(val)
    return this
  }

  lte(col, val) {
    this._wheres.push(`${col} <= $${this._wheres.length + 1}`)
    this._whereValues.push(val)
    return this
  }

  gt(col, val) {
    this._wheres.push(`${col} > $${this._wheres.length + 1}`)
    this._whereValues.push(val)
    return this
  }

  gte(col, val) {
    this._wheres.push(`${col} >= $${this._wheres.length + 1}`)
    this._whereValues.push(val)
    return this
  }

  is(col, val) {
    if (val === null) {
      this._wheres.push(`${col} IS NULL`)
    } else {
      this._wheres.push(`${col} IS NOT NULL`)
    }
    return this
  }

  ilike(col, val) {
    this._wheres.push(`${col} ILIKE $${this._wheres.length + 1}`)
    this._whereValues.push(val)
    return this
  }

  order(col, { ascending = true } = {}) {
    this._order = col
    this._orderAsc = ascending
    return this
  }

  limit(n) {
    this._limit = n
    return this
  }

  single() {
    this._single = true
    this._limit = 1
    return this._execute()
  }

  // Make it thenable so await works without .single()
  then(resolve, reject) {
    return this._execute().then(resolve, reject)
  }

  async _execute() {
    try {
      if (this._insertData) {
        const results = []
        for (const row of this._insertData) {
          const keys = Object.keys(row)
          const vals = Object.values(row)
          const cols = keys.join(', ')
          const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')
          const result = await query(
            `INSERT INTO ${this._table} (${cols}) VALUES (${placeholders}) RETURNING *`,
            vals
          )
          results.push(result.rows[0])
        }
        const data = this._single ? results[0] : results
        return { data, error: null }
      }

      if (this._updateData) {
        const keys = Object.keys(this._updateData)
        const vals = Object.values(this._updateData)
        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ')
        const whereClause = this._wheres.length
          ? `WHERE ` + this._wheres.map((w, i) => w.replace(/\$(\d+)/g, (_, n) => `$${parseInt(n) + keys.length}`)).join(' AND ')
          : ''
        await query(
          `UPDATE ${this._table} SET ${setClause} ${whereClause}`,
          [...vals, ...this._whereValues]
        )
        return { data: null, error: null }
      }

      if (this._deleteFlag) {
        const whereClause = this._wheres.length
          ? `WHERE ` + this._wheres.join(' AND ')
          : ''
        await query(`DELETE FROM ${this._table} ${whereClause}`, this._whereValues)
        return { data: null, error: null }
      }

      // SELECT
      const whereClause = this._wheres.length ? `WHERE ` + this._wheres.join(' AND ') : ''
      const orderClause = this._order ? `ORDER BY ${this._order} ${this._orderAsc ? 'ASC' : 'DESC'}` : ''
      const limitClause = this._limit ? `LIMIT ${this._limit}` : ''

      const result = await query(
        `SELECT ${this._select} FROM ${this._table} ${whereClause} ${orderClause} ${limitClause}`,
        this._whereValues
      )

      const data = this._single ? (result.rows[0] || null) : result.rows
      const error = this._single && !result.rows[0] ? { message: 'Row not found' } : null

      return { data, error }

    } catch (err) {
      console.error(`DB Error [${this._table}]:`, err.message)
      return { data: null, error: { message: err.message } }
    }
  }
}

export const supabaseAdmin = buildClient()
export const supabase = buildClient()