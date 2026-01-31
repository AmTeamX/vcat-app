import { getDB } from '@/lib/db';
import { getDoctorFromSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const doctorId = await getDoctorFromSession(request);

        if (!doctorId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = await getDB();

        // Get doctor details
        const result: any = await db.query(
            'SELECT id, name, email, created_at FROM doctors WHERE id = $doctorId',
            { doctorId }
        );

        const doctors = result[0];

        if (!doctors || doctors.length === 0) {
            return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
        }

        return NextResponse.json({ doctor: doctors[0] });
    } catch (error) {
        console.error('Error fetching doctor info:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
