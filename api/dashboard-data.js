// api/dashboard-data.js
// Serverless Function para Vercel
const { Pool } = require('pg');

// Configuración de la base de datos desde variables de entorno
const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Datos por plataforma
        const platformData = await pool.query(`
            SELECT 
                primary_platform as name,
                ROUND(AVG(happiness_score)::numeric, 2) as happiness,
                COUNT(*) as users,
                ROUND(AVG(screen_time_hours)::numeric, 2) as "screenTime",
                ROUND(AVG(stress_level)::numeric, 2) as stress,
                ROUND(AVG(sleep_quality)::numeric, 2) as sleep
            FROM users
            GROUP BY primary_platform
            ORDER BY happiness DESC
        `);

        // Impacto del tiempo de pantalla
        const screenTimeImpact = await pool.query(`
            SELECT 
                CASE 
                    WHEN screen_time_hours < 4 THEN 'Low (< 4 hrs)'
                    WHEN screen_time_hours BETWEEN 4 AND 6 THEN 'Medium (4-6 hrs)'
                    ELSE 'High (6+ hrs)'
                END as category,
                ROUND(AVG(happiness_score)::numeric, 2) as happiness,
                COUNT(*) as users,
                ROUND(AVG(sleep_quality)::numeric, 2) as sleep,
                ROUND(AVG(stress_level)::numeric, 2) as stress
            FROM users
            GROUP BY category
            ORDER BY 
                CASE category
                    WHEN 'Low (< 4 hrs)' THEN 1
                    WHEN 'Medium (4-6 hrs)' THEN 2
                    ELSE 3
                END
        `);

        // Impacto del sueño
        const sleepImpact = await pool.query(`
            SELECT 
                CASE 
                    WHEN sleep_quality < 5 THEN 'Poor (< 5)'
                    WHEN sleep_quality BETWEEN 5 AND 7 THEN 'Fair (5-7)'
                    ELSE 'Good (7+)'
                END as category,
                ROUND(AVG(happiness_score)::numeric, 2) as happiness,
                COUNT(*) as users,
                ROUND(AVG(screen_time_hours)::numeric, 2) as "screenTime",
                ROUND(AVG(stress_level)::numeric, 2) as stress
            FROM users
            GROUP BY category
            ORDER BY 
                CASE category
                    WHEN 'Poor (< 5)' THEN 1
                    WHEN 'Fair (5-7)' THEN 2
                    ELSE 3
                END
        `);

        // Grupos de edad
        const ageGroupData = await pool.query(`
            SELECT 
                CASE 
                    WHEN age BETWEEN 18 AND 24 THEN '18-24'
                    WHEN age BETWEEN 25 AND 34 THEN '25-34'
                    WHEN age BETWEEN 35 AND 44 THEN '35-44'
                    ELSE '45+'
                END as "group",
                ROUND(AVG(happiness_score)::numeric, 2) as happiness,
                COUNT(*) as users,
                ROUND(AVG(screen_time_hours)::numeric, 2) as "screenTime",
                ROUND(AVG(stress_level)::numeric, 2) as stress
            FROM users
            GROUP BY "group"
            ORDER BY 
                CASE "group"
                    WHEN '18-24' THEN 1
                    WHEN '25-34' THEN 2
                    WHEN '35-44' THEN 3
                    ELSE 4
                END
        `);

        // Datos por género
        const genderData = await pool.query(`
            SELECT 
                gender,
                ROUND(AVG(happiness_score)::numeric, 2) as happiness,
                COUNT(*) as users,
                ROUND(AVG(exercise_frequency)::numeric, 2) as exercise
            FROM users
            GROUP BY gender
            ORDER BY happiness DESC
        `);

        // Impacto del ejercicio
        const exerciseImpact = await pool.query(`
            SELECT 
                CASE 
                    WHEN exercise_frequency < 2 THEN 'Low (< 2/week)'
                    WHEN exercise_frequency BETWEEN 2 AND 4 THEN 'Medium (2-4/week)'
                    ELSE 'High (4+/week)'
                END as category,
                ROUND(AVG(happiness_score)::numeric, 2) as happiness,
                COUNT(*) as users,
                ROUND(AVG(stress_level)::numeric, 2) as stress
            FROM users
            GROUP BY category
            ORDER BY 
                CASE category
                    WHEN 'Low (< 2/week)' THEN 1
                    WHEN 'Medium (2-4/week)' THEN 2
                    ELSE 3
                END
        `);

        // Enviar respuesta
        res.status(200).json({
            platformData: platformData.rows,
            screenTimeImpact: screenTimeImpact.rows,
            sleepImpact: sleepImpact.rows,
            ageGroupData: ageGroupData.rows,
            genderData: genderData.rows,
            exerciseImpact: exerciseImpact.rows
        });

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
};
