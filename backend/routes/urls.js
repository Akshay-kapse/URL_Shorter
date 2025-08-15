const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const { generateShortCode, isValidUrl, normalizeUrl } = require('../lib/utils');

// POST /api/shorten - Create shortened URL
router.post('/shorten', async (req, res) => {
  try {
    const { url: originalUrl, shortCode: customShortCode } = req.body;

    // Validate input
    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    // Normalize and validate URL
    const normalizedUrl = normalizeUrl(originalUrl);
    if (!isValidUrl(normalizedUrl)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid URL'
      });
    }

    // Generate or use custom short code
    let shortCode = customShortCode;
    if (!shortCode) {
      // Generate unique short code
      do {
        shortCode = generateShortCode();
      } while (await Url.findOne({ short_code: shortCode }));
    } else {
      // Validate custom short code
      if (!/^[a-zA-Z0-9_-]+$/.test(shortCode)) {
        return res.status(400).json({
          success: false,
          error: 'Short code can only contain letters, numbers, hyphens, and underscores'
        });
      }

      // Check if custom short code already exists
      const existingUrl = await Url.findOne({ short_code: shortCode });
      if (existingUrl) {
        return res.status(409).json({
          success: false,
          error: 'Short code already exists. Please choose a different one.'
        });
      }
    }

    // Check if URL already exists
    const existingUrl = await Url.findOne({ original_url: normalizedUrl });
    if (existingUrl) {
      return res.json({
        success: true,
        data: {
          original_url: existingUrl.original_url,
          short_code: existingUrl.short_code,
          short_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${existingUrl.short_code}`,
          visit_count: existingUrl.visit_count,
          created_at: existingUrl.createdAt
        },
        message: 'URL already shortened'
      });
    }

    // Create new URL entry
    const newUrl = new Url({
      original_url: normalizedUrl,
      short_code: shortCode
    });

    await newUrl.save();

    res.json({
      success: true,
      data: {
        original_url: newUrl.original_url,
        short_code: newUrl.short_code,
        short_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${newUrl.short_code}`,
        visit_count: newUrl.visit_count,
        created_at: newUrl.createdAt
      },
      message: 'URL shortened successfully'
    });

  } catch (error) {
    console.error('Error in /api/shorten:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;