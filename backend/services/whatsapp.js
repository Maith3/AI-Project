const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendDoctorAlert(phone, patientName, riskLevel) {
  const cleanPhone = phone.replace(/\D/g, ''); 
  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${cleanPhone}`,
    body: `🚨 MaatruCare PATIENT ALERT
Patient: ${patientName}
Status: ${riskLevel}

Urgent action required!`
  });
}

module.exports = { sendDoctorAlert };
