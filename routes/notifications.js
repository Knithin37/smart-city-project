const express = require('express');
const router  = express.Router();

let notifications = [
  { id:1, icon:'⚠️',  type:'Health',    title:'High AQI Alert',                        text:'Air quality index has reached unhealthy levels. Stay indoors.',              time: new Date(Date.now()-3600000).toISOString(),  read:false },
  { id:2, icon:'👨‍⚕️', type:'Health',    title:'Dr. Smith responded',                   text:'Dr. Smith responded to your health query. Check your messages.',             time: new Date(Date.now()-7200000).toISOString(),  read:false },
  { id:3, icon:'🏥',  type:'Health',    title:'Mount Sinai updated visiting hours',     text:'New visiting hours are now in effect. Tap to view.',                         time: new Date(Date.now()-10800000).toISOString(), read:true  },
  { id:4, icon:'⛈',  type:'Weather',   title:'Severe Thunderstorm Warning',            text:'Active until 8:00 PM tonight. Secure loose outdoor items.',                  time: new Date(Date.now()-14400000).toISOString(), read:true  },
  { id:5, icon:'🚨',  type:'Emergency', title:'Emergency Alert: 5-car accident',        text:'Reported on I-495. Paramedics on scene. Expect significant delays.',          time: new Date(Date.now()-18000000).toISOString(), read:true  },
];
let nextId = 6;

router.get('/',         (_req, res) => res.json(notifications));
router.patch('/:id/read', (req, res) => {
  const n = notifications.find(n => n.id === parseInt(req.params.id));
  if (n) n.read = true;
  res.json({ ok: true });
});
router.patch('/read-all', (_req, res) => {
  notifications.forEach(n => n.read = true);
  res.json({ ok: true });
});
router.post('/', (req, res) => {
  const { icon, type, title, text } = req.body;
  const notif = { id: nextId++, icon: icon||'🔔', type: type||'General', title, text, time: new Date().toISOString(), read: false };
  notifications.unshift(notif);
  res.status(201).json(notif);
});

module.exports = router;
