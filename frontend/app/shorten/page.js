"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { apiClient } from '@/lib/api'

const Shorten = () => {
    const [url, setUrl] = useState("")
    const [shortCode, setShortCode] = useState("")
    const [generated, setGenerated] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [urlData, setUrlData] = useState(null)

    const generate = async () => {
        if (!url.trim()) {
            setError("Please enter a URL");
            return;
        }

        setLoading(true);
        setError("");
        setGenerated("");
        setUrlData(null);

        try {
            const result = await apiClient.shortenUrl(
                url.trim(),
                shortCode.trim() || undefined
            );
            
            if (result.success) {
                setGenerated(result.data.short_url);
                setUrlData(result.data);
                setUrl("");
                setShortCode("");
            } else {
                setError(result.error || "An error occurred");
            }
        } catch (error) {
            setError(error.message || "Network error. Please try again.");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generated);
            alert("Link copied to clipboard!");
        } catch (err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = generated;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                alert("Link copied to clipboard!");
            } catch (err) {
                alert("Failed to copy link");
            }
            document.body.removeChild(textArea);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            generate();
        }
    }

    return (
        <div className='mx-auto max-w-2xl bg-white my-16 p-8 rounded-lg shadow-lg'>
            <div className="text-center mb-8">
                <h1 className='font-bold text-3xl text-gray-900 mb-2'>Generate Short URLs</h1>
                <p className="text-gray-600">Transform your long URLs into short, shareable links</p>
            </div>
            
            {error && (
                <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6'>
                    <div className="flex items-center">
                        <span className="text-red-500 mr-2">⚠️</span>
                        {error}
                    </div>
                </div>
            )}
            
            <div className='space-y-4'>
                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                        Original URL *
                    </label>
                    <input 
                        id="url"
                        type="text"
                        value={url}
                        className='w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent rounded-md'
                        placeholder='Enter your URL (e.g., https://example.com/very/long/path)'
                        onChange={e => setUrl(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="shortCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Short Code (optional)
                    </label>
                    <input 
                        id="shortCode"
                        type="text"
                        value={shortCode}
                        className='w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent rounded-md'
                        placeholder='Custom code (letters, numbers, hyphens, underscores)'
                        onChange={e => setShortCode(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Leave empty to generate automatically
                    </p>
                </div>
                
                <button 
                    onClick={generate} 
                    disabled={loading || !url.trim()}
                    className='w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed rounded-lg shadow-lg p-3 font-bold text-white transition-colors flex items-center justify-center'
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating...
                        </>
                    ) : (
                        'Generate Short URL'
                    )}
                </button>
            </div>

            {generated && urlData && (
                <div className='bg-green-50 border border-green-200 p-6 rounded-lg mt-6'>
                    <h3 className='font-bold text-lg mb-4 text-green-800 flex items-center'>
                        <span className="text-green-500 mr-2">✅</span>
                        Success! Your short URL is ready
                    </h3>
                    
                    <div className='space-y-4'>
                        <div className='flex items-center gap-2'>
                            <div className='bg-white border border-green-200 px-4 py-3 rounded-md flex-1'>
                                <Link 
                                    target="_blank" 
                                    href={generated} 
                                    className='text-purple-600 hover:text-purple-800 font-mono break-all'
                                >
                                    {generated}
                                </Link>
                            </div>
                            <button 
                                onClick={copyToClipboard}
                                className='bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-md font-medium transition-colors whitespace-nowrap'
                            >
                                Copy
                            </button>
                        </div>
                        
                        <div className='text-sm text-gray-600 space-y-1'>
                            <p><strong>Original URL:</strong> <span className="break-all">{urlData.original_url}</span></p>
                            <p><strong>Short Code:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{urlData.short_code}</code></p>
                            <p><strong>Visits:</strong> {urlData.visit_count}</p>
                            <p><strong>Created:</strong> {new Date(urlData.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 text-center">
                <Link href="/" className="text-purple-600 hover:text-purple-800">
                    ← Back to Home
                </Link>
            </div>
        </div>
    )
}

export default Shorten