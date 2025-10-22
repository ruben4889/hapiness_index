// api/dashboard-data.js
// Serverless Function para Vercel
const { Pool } = require('pg');

// Configuración de la base de datos desde variables de entorno
const pool = new Pool({
    host: process.env.DB_HOST,       // host de tu Azure Postgres
    database: process.env.DB_NAME,   // nombre de la base de datos
    user: process.env.DB_USER,       // usuario
    password: process.env.DB_PASSWORD, // contraseña
    port: process.env.DB_PORT || 5432,
    ssl: {
        rejectUnauthorized: false    // necesario si Azure usa certificado auto-firmado
    }
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
            social_media_platform AS name,
            ROUND(AVG("Happiness_Index(1-10)")::numeric, 2) AS happiness,
            COUNT(*) AS users,
            ROUND(AVG("Daily_Screen_Time(hrs)")::numeric, 2) AS "screenTime",
            ROUND(AVG("Stress_Level(1-10)")::numeric, 2) AS stress,
            ROUND(AVG("Sleep_Quality(1-10)")::numeric, 2) AS sleep
        FROM social_media.social_media
        GROUP BY social_media_platform
        ORDER BY happiness DESC
    `);

    // Impacto del tiempo de pantalla
    const screenTimeImpact = await pool.query(`
        SELECT 
            CASE 
                WHEN "Daily_Screen_Time(hrs)" < 4 THEN 'Low (< 4 hrs)'
                WHEN "Daily_Screen_Time(hrs)" BETWEEN 4 AND 6 THEN 'Medium (4-6 hrs)'
                ELSE 'High (6+ hrs)'
            END AS category,
            ROUND(AVG("Happiness_Index(1-10)")::numeric, 2) AS happiness,
            COUNT(*) AS users,
            ROUND(AVG("Sleep_Quality(1-10)")::numeric, 2) AS sleep,
            ROUND(AVG("Stress_Level(1-10)")::numeric, 2) AS stress
        FROM social_media
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
        WHEN "Sleep_Quality(1-10)" < 5 THEN 'Poor (< 5)'
        WHEN "Sleep_Quality(1-10)" BETWEEN 5 AND 6 THEN 'Fair (5-6)'
        ELSE 'Good (7+)'
    END AS category,
    ROUND(AVG("Happiness_Index(1-10)")::numeric, 2) AS happiness,
    COUNT(*) AS users,
    ROUND(AVG("Daily_Screen_Time(hrs)")::numeric, 2) AS "screenTime",
    ROUND(AVG("Stress_Level(1-10)")::numeric, 2) AS stress
FROM social_media.social_media
GROUP BY 
    CASE 
        WHEN "Sleep_Quality(1-10)" < 5 THEN 'Poor (< 5)'
        WHEN "Sleep_Quality(1-10)" BETWEEN 5 AND 6 THEN 'Fair (5-6)'
        ELSE 'Good (7+)'
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
    END AS age_group,
    ROUND(AVG("Happiness_Index(1-10)")::numeric, 2) AS happiness,
    COUNT(*) AS users,
    ROUND(AVG("Daily_Screen_Time(hrs)")::numeric, 2) AS "screenTime",
    ROUND(AVG("Stress_Level(1-10)")::numeric, 2) AS stress
FROM social_media.social_media
GROUP BY 
    CASE 
        WHEN age BETWEEN 18 AND 24 THEN '18-24'
        WHEN age BETWEEN 25 AND 34 THEN '25-34'
        WHEN age BETWEEN 35 AND 44 THEN '35-44'
        ELSE '45+'
    END
    `);

    // Datos por género
    const genderData = await pool.query(`
       SELECT 
    gender,
    ROUND(AVG("Happiness_Index(1-10)")::numeric, 2) AS happiness,
    COUNT(*) AS users,
    ROUND(AVG("Exercise_Frequency(week)")::numeric, 2) AS exercise
FROM social_media.social_media
GROUP BY gender
ORDER BY happiness DESC;
    `);

    // Impacto del ejercicio
    const exerciseImpact = await pool.query(`
        SELECT 
    CASE 
        WHEN "Exercise_Frequency(week)" < 2 THEN 'Low (< 2/week)'
        WHEN "Exercise_Frequency(week)" BETWEEN 2 AND 4 THEN 'Medium (2-4/week)'
        ELSE 'High (4+/week)'
    END AS category,
    ROUND(AVG("Happiness_Index(1-10)")::numeric, 2) AS happiness,
    COUNT(*) AS users,
    ROUND(AVG("Stress_Level(1-10)")::numeric, 2) AS stress
FROM social_media.social_media
GROUP BY 
    CASE 
        WHEN "Exercise_Frequency(week)" < 2 THEN 'Low (< 2/week)'
        WHEN "Exercise_Frequency(week)" BETWEEN 2 AND 4 THEN 'Medium (2-4/week)'
        ELSE 'High (4+/week)'
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
