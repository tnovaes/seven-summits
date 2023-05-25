import { db } from "../database/database.connection.js";

export async function getFlightsBySummit(req, res) {
    const { summit } = req.params;
    try {
        const { rows } = await db.query(`
        SELECT  json_agg(json_build_object(
            'airline', ac.name,
            'origin', co.name,
            'destination', cd.name,
            'depart', f.depart,
            'arrival', f.arrival,
            'price', f.price
          )) AS flights
        FROM flights f
        JOIN airline_companies ac ON f.airline_id = ac.id
        JOIN cities_origin co ON f.origin_id = co.id
        JOIN cities_destination cd ON f.destination_id = cd.id
        WHERE f.destination_id = (
            SELECT id FROM cities_destination WHERE summit = $1);`, [summit]);

        res.status(200).send(rows[0].flights);

    } catch (err) {
        res.status(500).send(err.message);
    }
}