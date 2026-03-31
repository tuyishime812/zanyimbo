import { useState } from 'react'
import { Share2, Copy, Check, Facebook, Twitter, Linkedin } from 'lucide-react'
import { shareSong, shareAlbum, shareArtist, copyToClipboard } from '../lib/socialShare'
import './SocialShare.css'

export default function SocialShare({ type, data, onShare }) {
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const getShareFunctions = () => {
    switch (type) {
      case 'song':
        return shareSong(data)
      case 'album':
        return shareAlbum(data)
      case 'artist':
        return shareArtist(data)
      default:
        return null
    }
  }

  const shareFunctions = getShareFunctions()

  if (!shareFunctions) return null

  const handleCopy = async () => {
    const success = await shareFunctions.copy()
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      if (onShare) onShare('copy')
    }
  }

  const handleShare = (platform) => {
    if (onShare) onShare(platform)
  }

  return (
    <div className="social-share">
      <div className="social-share-title">Share this {type}</div>
      
      <div className="social-share-buttons">
        <button
          className="share-btn whatsapp"
          onClick={() => {
            shareFunctions.whatsapp()
            handleShare('whatsapp')
          }}
          aria-label="Share on WhatsApp"
        >
          <Share2 size={18} />
        </button>
        
        <button
          className="share-btn twitter"
          onClick={() => {
            shareFunctions.twitter()
            handleShare('twitter')
          }}
          aria-label="Share on Twitter"
        >
          <Twitter size={18} />
        </button>
        
        <button
          className="share-btn facebook"
          onClick={() => {
            shareFunctions.facebook()
            handleShare('facebook')
          }}
          aria-label="Share on Facebook"
        >
          <Facebook size={18} />
        </button>
        
        <button
          className="share-btn linkedin"
          onClick={() => {
            shareFunctions.linkedin()
            handleShare('linkedin')
          }}
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={18} />
        </button>
        
        <button
          className="share-btn copy"
          onClick={handleCopy}
          aria-label="Copy link"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>

      {copied && (
        <div className="share-success">
          Link copied to clipboard!
        </div>
      )}
    </div>
  )
}
