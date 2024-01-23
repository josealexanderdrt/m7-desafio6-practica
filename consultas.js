const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 
    database: 'vida_sana',
    allowExitOnIdle: true
})

const getEventos = async () => {
    const { rows: eventos } = await pool.query("SELECT * FROM eventos")
    return eventos
}

const deleteEvento = async (id) => {
    const consulta = "DELETE FROM eventos WHERE id = $1"
    const values = [id]
    const { rowCount } = await pool.query(consulta, values)
    if (!rowCount) throw { code: 404, message: "No se encontró ningún evento con este ID" }
}

const modificarevento = async (id, titulo, descripcion, fecha, lugar) => {
    const consulta = "UPDATE eventos SET titulo = COALESCE($2, titulo), descripcion = COALESCE($3, descripcion), fecha = COALESCE($4, fecha), lugar = COALESCE($5, lugar) WHERE id = $1";
    const values = [id, titulo, descripcion, fecha, lugar];

    const { rowCount } = await pool.query(consulta, values);

    if (!rowCount) {
        throw { code: 404, message: "No se encontró ningún evento con este ID" };
    }
}


const verificarCredenciales = async (email, password) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1 AND password = $2"
    const values = [email, password]
    const { rowCount } = await pool.query(consulta, values)
    if (!rowCount)
    throw { code: 404, message: "No se encontró ningún usuario con estas credenciales" }
    }
    

module.exports = { getEventos, deleteEvento,verificarCredenciales,modificarevento }
