import { test, expect, APIRequestContext } from '@playwright/test';

const BASE = 'https://restful-booker.herokuapp.com';
const JSON_HEADERS = { Accept: 'application/json' };

const booking = {
    firstname: 'Rafay',
    lastname: 'Tester',
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    additionalneeds: 'Breakfast',
};

async function createBooking(request: APIRequestContext) {
    const response = await request.post(`${BASE}/booking`, { data: booking, headers: JSON_HEADERS });
    expect(response.ok()).toBeTruthy();
    return (await response.json()) as { bookingid: number; booking: typeof booking };
}

async function getToken(request: APIRequestContext): Promise<string> {
    const response = await request.post(`${BASE}/auth`, {
        data: { username: 'admin', password: 'password123' },
    });
    expect(response.ok()).toBeTruthy();
    return (await response.json()).token;
}

test.describe('Restful Booker API', () => {
    test('creates a booking and returns it', { tag: '@api' }, async ({ request }) => {
        const created = await createBooking(request);
        expect(created.bookingid).toBeGreaterThan(0);
        expect(created.booking.firstname).toBe(booking.firstname);
        expect(created.booking.bookingdates).toEqual(booking.bookingdates);
    });

    test('fetches a booking by id', { tag: '@api' }, async ({ request }) => {
        const created = await createBooking(request);
        const response = await request.get(`${BASE}/booking/${created.bookingid}`, { headers: JSON_HEADERS });
        expect(response.status()).toBe(200);
        expect((await response.json()).lastname).toBe(booking.lastname);
    });

    test('rejects delete without authorization', { tag: '@api' }, async ({ request }) => {
        const created = await createBooking(request);
        const response = await request.delete(`${BASE}/booking/${created.bookingid}`);
        expect(response.status()).toBe(403);
    });

    test('deletes a booking with a valid token', { tag: '@api' }, async ({ request }) => {
        const created = await createBooking(request);
        const token = await getToken(request);

        const deleted = await request.delete(`${BASE}/booking/${created.bookingid}`, {
            headers: { Cookie: `token=${token}` },
        });
        expect(deleted.status()).toBe(201);

        const after = await request.get(`${BASE}/booking/${created.bookingid}`);
        expect(after.status()).toBe(404);
    });
});