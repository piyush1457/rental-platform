const express = require('express');
const router = express.Router();
const Rental = require('../models/Rental');

// Cancel a rental
router.patch('/:rentalId/cancel', async (req, res) => {
  const { rentalId } = req.params;

  try {
    const rental = await Rental.findOne({ rentalId });

    if (!rental) {
      return res.status(404).json({ error: 'Rental not found' });
    }

    if (rental.status === 'cancelled') {
      return res.status(400).json({ error: 'Order is already cancelled' });
    }

    rental.status = 'cancelled';
    rental.cancellationId = `CANCEL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    await rental.save();

    res.status(200).json({
      cancellationId: rental.cancellationId,
      cancelledOrder: {
        items: rental.items,
        total: rental.total,
      },
    });
  } catch (err) {
    console.error('Cancellation failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
