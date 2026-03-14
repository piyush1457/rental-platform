require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rentalPlatform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const products = [
  // Tech & Electronics
  { name: 'Canon EOS R7 DSLR Camera', description: 'Professional mirrorless camera with 18-150mm lens.', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400', price: 600 },
  { name: 'Sony A7III Mirrorless Body', description: 'Full-frame mirrorless camera for cinematic video.', image: 'https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&q=80&w=400', price: 800 },
  { name: 'DJI Mavic 3 Pro Drone', description: '4K drone for stunning aerial photography and video.', image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&q=80&w=400', price: 1200 },
  { name: 'GoPro Hero 11 Black', description: 'Rugged action camera for sports and adventures.', image: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?auto=format&fit=crop&q=80&w=400', price: 300 },
  { name: 'MacBook Pro 16" M2 Max', description: 'High-performance laptop for heavy editing workloads.', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400', price: 1500 },
  { name: 'Epson 1080p Home Projector', description: 'HD projector for outdoor movie nights or presentations.', image: 'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&q=80&w=400', price: 500 },
  { name: 'Rode NT1 Studio Condenser Mic', description: 'Professional studio microphone for podcasts.', image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=400', price: 200 },
  { name: 'Oculus Quest 2 VR Headset', description: 'Virtual reality headset for immersive gaming.', image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=400', price: 450 },
  { name: 'JBL PartyBox 310 Speaker', description: 'Loud Bluetooth speaker with bass boost & lights.', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=400', price: 350 },
  { name: 'iPad Pro 12.9" with Pencil', description: 'Tablet perfect for digital artists on the go.', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400', price: 600 },
  { name: 'Anker 20000mAh Power Bank', description: 'High capacity portable charger.', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&q=80&w=400', price: 80 },
  { name: 'DJI Ronin-S Gimbal', description: 'Stabilizer for DSLR and mirrorless cameras.', image: 'https://images.unsplash.com/photo-1580228830113-fe0da9eb1b7c?auto=format&fit=crop&q=80&w=400', price: 250 },

  // Camping & Outdoors
  { name: 'Coleman 4-Person Pop-up Tent', description: 'Easy setup camping tent for family trips.', image: 'https://images.unsplash.com/photo-1504280327387-5c3a378d38cb?auto=format&fit=crop&q=80&w=400', price: 400 },
  { name: 'Yeti Tundra 45 Cooler', description: 'Heavy-duty cooler keeps ice for days.', image: 'https://images.unsplash.com/photo-1615562095647-81bd2e3895e7?auto=format&fit=crop&q=80&w=400', price: 300 },
  { name: 'Intex Inflatable Kayak', description: '2-person kayak with oars and pump included.', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400', price: 450 },
  { name: 'Trek Marlin 5 Mountain Bike', description: 'Trail-ready bike with disc brakes and suspension.', image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=400', price: 350 },
  { name: 'Therm-a-Rest Sleeping Pad', description: 'Insulated sleeping pad for winter camping.', image: 'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&q=80&w=400', price: 100 },
  { name: 'Black Diamond Headlamp', description: 'Rechargeable 400-lumen headlamp for night hikes.', image: 'https://images.unsplash.com/photo-1506198642738-9cefc8017d91?auto=format&fit=crop&q=80&w=400', price: 50 },

  // Power Tools
  { name: 'DeWalt 20V Cordless Drill', description: 'Heavy duty drill/driver kit with battery.', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400', price: 150 },
  { name: 'Makita Circular Saw', description: 'Powerful 15 AMP saw for framing and cutting.', image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=400', price: 200 },
  { name: 'Honda 2200W Generator', description: 'Super quiet portable inverter generator.', image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=400', price: 600 },
  { name: 'Husqvarna Chainsaw', description: 'Gas powered chainsaw for tree cutting.', image: 'https://images.unsplash.com/photo-1577717903541-118e40f5adcd?auto=format&fit=crop&q=80&w=400', price: 350 },

  // Event & Party Gear
  { name: 'Smoke Machine 400W', description: 'Great for parties, weddings, and DJ setups.', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=400', price: 120 },
  { name: 'Fender Stratocaster Electric Guitar', description: 'Classic rock electric guitar, amp not included.', image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?auto=format&fit=crop&q=80&w=400', price: 300 },
  { name: 'Folding Banquet Table (6ft)', description: 'Sturdy table for events and catering.', image: 'https://images.unsplash.com/photo-1481016570479-9eab6349fde7?auto=format&fit=crop&q=80&w=400', price: 100 },
  { name: 'Pioneer DJ XDJ-RX3 Controller', description: 'All-in-one DJ system for professional mixing.', image: 'https://images.unsplash.com/photo-1571266028243-d3a682ccde08?auto=format&fit=crop&q=80&w=400', price: 900 },
  { name: 'String Lights (100ft)', description: 'Warm white outdoor string lights for ambiance.', image: 'https://images.unsplash.com/photo-1510074468202-b2518e154fb0?auto=format&fit=crop&q=80&w=400', price: 80 }
];

async function seedDB() {
  try {
    await Product.deleteMany({});
    console.log('Cleared existing products');

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} dynamic products successfully!`);
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    process.exit();
  }
}

seedDB();
