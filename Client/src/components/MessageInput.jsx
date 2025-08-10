import React, { useState, useRef, useEffect } from 'react';
import { FiPaperclip, FiSmile, FiMic, FiSend, FiImage, FiFile } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';

const MessageInput = ({ wa_id, onSend, onAttach, isSending = false }) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const attachmentMenuRef = useRef(null);

  // Close emoji picker and attachment menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target)) {
        setAttachmentMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(wa_id, text);
    setText('');
    inputRef.current.focus();
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setText(prevText => prevText + emojiData.emoji);
    inputRef.current.focus();
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Here you would integrate with a voice recording API
  };

  const handleAttachmentClick = (type) => {
    setAttachmentMenuOpen(false);
    if (onAttach) {
      onAttach(type);
    }
  };

  return (
    <div className="relative">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-16 left-14 z-10">
          <EmojiPicker 
            onEmojiClick={handleEmojiClick} 
            width={300}
            height={350}
            searchDisabled={false}
            skinTonesDisabled
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}

      {/* Attachment Menu */}
      {attachmentMenuOpen && (
        <div 
          ref={attachmentMenuRef}
          className="absolute bottom-16 left-14 bg-white shadow-lg rounded-lg p-2 z-10 w-48"
        >
          <button
            onClick={() => handleAttachmentClick('image')}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <FiImage className="mr-2" /> Photo/Image
          </button>
          <button
            onClick={() => handleAttachmentClick('file')}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <FiFile className="mr-2" /> Document
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex p-3 border-t bg-white items-center relative"
      >
        {/* Attachment Button with dropdown */}
        <div className="relative">
          <button
            type="button"
            aria-label="Attach file"
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full mx-1 hover:bg-gray-100 transition-colors"
            onClick={() => setAttachmentMenuOpen(!attachmentMenuOpen)}
          >
            <FiPaperclip size={20} />
          </button>
        </div>
        
        {/* Emoji Picker Button */}
        <button
          type="button"
          aria-label="Add emoji"
          className={`p-2 rounded-full mx-1 hover:bg-gray-100 transition-colors ${
            showEmojiPicker ? 'text-green-500' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <FiSmile size={20} />
        </button>
        
        {/* Voice Recording Button */}
        <button
          type="button"
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          className={`p-2 rounded-full mx-1 hover:bg-gray-100 transition-colors ${
            isRecording ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={toggleRecording}
        >
          <FiMic size={20} />
        </button>
        
        {/* Message Input */}
        <div className="flex-1 mx-2">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            aria-label="Message input"
            disabled={isSending}
          />
        </div>
        
        {/* Send Button */}
        <button
          type="submit"
          disabled={!text.trim() || isSending}
          aria-label="Send message"
          className={`p-2 rounded-full mx-1 transition-colors ${
            text.trim() 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          } ${isSending ? 'opacity-70' : ''}`}
        >
          {isSending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FiSend size={20} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;