const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const { verifyAdminAuth } = require('../lib/utils');

// POST /api/admin/auth - Authenticate admin
router.post('/auth', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Authorization header required'
      });
    }

    const isValid = verifyAdminAuth(authHeader);
    
    if (isValid) {
      res.json({
        success: true,
        message: 'Authentication successful'
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid password'
      });
    }
  } catch (error) {
    console.error('Error in /api/admin/auth:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
});

// GET /api/admin/urls - Get all URLs with stats
router.get('/urls', async (req, res) => {
  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!verifyAdminAuth(authHeader)) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    // Get all URLs with stats
    const urls = await Url.find({}).sort({ createdAt: -1 }).lean();
    
    // Calculate stats
    const totalUrls = urls.length;
    const totalVisits = urls.reduce((sum, url) => sum + (url.visit_count || 0), 0);
    
    // URLs created in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentUrls = urls.filter(url => new Date(url.createdAt) > oneDayAgo).length;

    // Format URLs for frontend
    const formattedUrls = urls.map(url => ({
      _id: url._id.toString(),
      original_url: url.original_url,
      short_code: url.short_code,
      visit_count: url.visit_count || 0,
      created_at: url.createdAt,
      updated_at: url.updatedAt
    }));

    res.json({
      success: true,
      data: {
        urls: formattedUrls,
        stats: {
          totalUrls,
          totalVisits,
          recentUrls
        }
      }
    });

  } catch (error) {
    console.error('Error in /api/admin/urls:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// DELETE /api/admin/urls/:shortCode - Delete URL
router.delete('/urls/:shortCode', async (req, res) => {
  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!verifyAdminAuth(authHeader)) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    const { shortCode } = req.params;
    
    if (!shortCode) {
      return res.status(400).json({
        success: false,
        error: 'Short code is required'
      });
    }

    // Delete the URL
    const deletedUrl = await Url.findOneAndDelete({ short_code: shortCode });
    
    if (!deletedUrl) {
      return res.status(404).json({
        success: false,
        error: 'URL not found'
      });
    }

    // Get updated stats
    const urls = await Url.find({}).lean();
    const totalUrls = urls.length;
    const totalVisits = urls.reduce((sum, url) => sum + (url.visit_count || 0), 0);
    
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentUrls = urls.filter(url => new Date(url.createdAt) > oneDayAgo).length;

    res.json({
      success: true,
      message: 'URL deleted successfully',
      data: {
        deletedUrl: {
          short_code: deletedUrl.short_code,
          original_url: deletedUrl.original_url
        },
        stats: {
          totalUrls,
          totalVisits,
          recentUrls
        }
      }
    });

  } catch (error) {
    console.error('Error in DELETE /api/admin/urls/:shortCode:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;