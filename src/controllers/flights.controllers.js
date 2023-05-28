import { db } from "../database/database.connection.js";

export async function getFlightsBySummit(req, res) {
    const { summit } = req.body;
    try {
        const { rows } = await db.query(`
        SELECT  json_agg(json_build_object(
            'id', f.id,
            'origin', co.name,
            'depart', f.depart,
            'price', f.price
          )) AS flights
        FROM flights f
        JOIN cities_origin co ON f.origin_id = co.id
        WHERE f.destination_id = (
            SELECT id FROM cities_destination WHERE summit = $1);`, [summit]);

        res.status(200).send(rows[0].flights);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getFlightInfo(req, res) {
    const { id } = req.params;
    try {
        const { rows } = await db.query(`
        SELECT json_build_object(
            'airline', ac.name,
            'origin', co.name,
            'destination', cd.name,
            'depart', f.depart,
            'arrival', f.arrival,
            'price', f.price
          ) AS flight
        FROM flights f
        JOIN airline_companies ac ON f.airline_id = ac.id
        JOIN cities_origin co ON f.origin_id = co.id
        JOIN cities_destination cd ON f.destination_id = cd.id
        WHERE f.id = $1;`, [id]);

        res.status(200).send(rows[0].flight);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function insertFlight(req, res) {
    const { airline, origin, destination, depart, arrival, price } = req.body;

    try {
        await db.query(`
        INSERT INTO flights (airline_id, origin_id, destination_id, depart, arrival, price)
        VALUES (
          (SELECT id FROM airline_companies WHERE name = $1),
          (SELECT id FROM cities_origin WHERE name = $2),
          (SELECT id FROM cities_destination WHERE name = $3),
          $4, $5, $6
        );
      `, [airline, origin, destination, depart, arrival, price]);

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}