// Share utility functions for book publishing

export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback for older browsers
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (fallbackErr) {
            console.error('Fallback copy failed:', fallbackErr);
            return false;
        }
    }
};

export const getBookShareUrl = (bookId: string): string => {
    return `${window.location.origin}/books/${bookId}`;
};

export const getSocialShareUrls = (
    url: string,
    title: string,
    description?: string
) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = description
        ? encodeURIComponent(description)
        : encodeURIComponent(`Check out my book: ${title}`);

    return {
        whatsapp: `https://wa.me/?text=${encodedTitle}%20-%20${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        email: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`,
    };
};

export const openSocialShare = (platform: keyof ReturnType<typeof getSocialShareUrls>, url: string, title: string, description?: string) => {
    const urls = getSocialShareUrls(url, title, description);
    window.open(urls[platform], '_blank', 'width=600,height=400');
};
