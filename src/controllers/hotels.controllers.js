import { db } from "../database/database.connection.js";

export async function getHotelsBySummit(req, res) {
    const { summit } = req.params;
    try {
        const { rows } = await db.query(`
        SELECT  json_agg(json_build_object(
            'id', h.id,
            'name', h.name,
            'price', h.price,
            'photo', p.url
        )) AS hotels
        FROM hotels h
        JOIN photos p ON h.main_photo_id = p.id
        WHERE h.city_id = (
            SELECT id FROM cities_destination WHERE summit = $1);`, [summit]);

        res.status(200).send(rows[0].hotels);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getHotelInfo(req, res) {
    const { id } = req.params;
    try {
        const { rows } = await db.query(`
        SELECT json_build_object(
            'name', h.name,
            'address', h.address,
            'price', h.price,
            'description', h.description,
            'photos', (
                SELECT json_agg(p.url)
                FROM photos p
                WHERE h.id = p.hotel_id
            ),
            'amenities', (
                SELECT json_agg(a.description)
                FROM hotel_amenities ha
                JOIN amenities a ON ha.amenity_id = a.id
                WHERE h.id = ha.hotel_id
            )
        ) AS hotel_info
        FROM hotels h
        WHERE h.id = $1;`, [id])

        res.status(200).send(rows[0].hotel_info);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function insertHotel(req, res) {
    const { city, name, address, price, description, main_photo_url } = req.body;

    try{
        await db.query(`
        WITH city_row AS (
            SELECT id
            FROM cities_destination
            WHERE name = $1
          ), inserted_hotel AS (
            INSERT INTO hotels (city_id, name, address, price, description)
            VALUES ((SELECT id FROM city_row), $2, $3, $4, $5 )
            RETURNING id
          ), inserted_photo AS (
            INSERT INTO photos (hotel_id, url)
            VALUES ((SELECT id FROM inserted_hotel), $6)
            RETURNING id
          )
        UPDATE hotels
        SET main_photo_id = (SELECT id FROM inserted_photo)
        WHERE id = (SELECT id FROM inserted_hotel);`
          , [city, name, address, price, description, main_photo_url]);

          res.sendstatus(201);
    } catch(err) {
        res.status(500).send(err.message);
    }
}