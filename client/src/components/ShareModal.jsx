import { toast } from "react-hot-toast";
import {
  XMarkIcon,
  ShareIcon,
  LinkIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

export const ShareModal = ({
  isOpen,
  onClose,
  title,
  description,
  forceUserView,
  salonId,
}) => {
  const getShareUrl = () => {
    if (forceUserView && salonId) {
      const baseUrl = window.location.origin;
      return `${baseUrl}/salons/${salonId}`;
    }

    if (!forceUserView) {
      return window.location.href;
    }

    return window.location.href;
  };
  const shareUrl = getShareUrl();
  const shareTitle = title || "Check this out!";
  const shareDescription =
    description || "Found something interesting to share with you.";

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied to clipboard!");
      onClose();
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const shareViaWebAPI = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl,
        });
        onClose();
      } catch (err) {
        if (err.name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      toast.error("Share not supported on this device");
    }
  };

  const shareToSocial = (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareDescription);

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-purple-500/20 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-lg flex items-center justify-center">
              <ShareIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Share</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 text-sm text-center mb-6">
            Share <span className="text-purple-400 font-medium">{title}</span>{" "}
            with others
          </p>

          {/* Quick Actions */}
          <div className="space-y-3 mb-6">
            {/* Copy Link */}
            <button
              onClick={() => copyToClipboard(shareUrl)}
              className="w-full flex items-center gap-3 p-3 bg-gray-900/50 hover:bg-gray-900/70 border border-gray-700 hover:border-purple-500/50 rounded-xl text-white transition-all duration-300"
            >
              <LinkIcon className="h-5 w-5 text-purple-400" />
              <span className="flex-1 text-left">Copy Link</span>
              <DocumentDuplicateIcon className="h-4 w-4 text-gray-400" />
            </button>

            {/* Native Share (if supported) */}
            {navigator.share && (
              <button
                onClick={shareViaWebAPI}
                className="w-full flex items-center gap-3 p-3 bg-gray-900/50 hover:bg-gray-900/70 border border-gray-700 hover:border-indigo-500/50 rounded-xl text-white transition-all duration-300"
              >
                <ShareIcon className="h-5 w-5 text-indigo-400" />
                <span className="flex-1 text-left">Share via Device</span>
              </button>
            )}
          </div>

          {/* Social Media Options */}
          <div>
            <p className="text-gray-400 text-sm mb-3">Share on social media</p>
            <div className="grid grid-cols-3 gap-3">
              {/* WhatsApp */}
              <button
                onClick={() => shareToSocial("whatsapp")}
                className="flex flex-col items-center gap-2 p-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 hover:border-green-500/50 rounded-xl transition-all duration-300"
              >
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">W</span>
                </div>
                <span className="text-green-300 text-xs">WhatsApp</span>
              </button>

              {/* Facebook */}
              <button
                onClick={() => shareToSocial("facebook")}
                className="flex flex-col items-center gap-2 p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-500/50 rounded-xl transition-all duration-300"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">f</span>
                </div>
                <span className="text-blue-300 text-xs">Facebook</span>
              </button>

              {/* Twitter */}
              <button
                onClick={() => shareToSocial("twitter")}
                className="flex flex-col items-center gap-2 p-3 bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/30 hover:border-sky-500/50 rounded-xl transition-all duration-300"
              >
                <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">𝕏</span>
                </div>
                <span className="text-sky-300 text-xs">Twitter</span>
              </button>

              {/* Telegram */}
              <button
                onClick={() => shareToSocial("telegram")}
                className="flex flex-col items-center gap-2 p-3 bg-blue-400/20 hover:bg-blue-400/30 border border-blue-400/30 hover:border-blue-400/50 rounded-xl transition-all duration-300"
              >
                <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                <span className="text-blue-300 text-xs">Telegram</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => shareToSocial("linkedin")}
                className="flex flex-col items-center gap-2 p-3 bg-blue-700/20 hover:bg-blue-700/30 border border-blue-600/30 hover:border-blue-600/50 rounded-xl transition-all duration-300"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">in</span>
                </div>
                <span className="text-blue-300 text-xs">LinkedIn</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
