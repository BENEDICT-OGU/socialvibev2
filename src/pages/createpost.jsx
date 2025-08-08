import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaFont, FaImage, FaVideo, FaMusic, FaGlobe, 
  FaUserLock, FaSmile, FaMapMarkerAlt, FaCalendarAlt, FaFilm,
  FaExclamationCircle, FaTimes, FaCheck, FaHashtag, FaAt,
  FaBold, FaItalic, FaUnderline, FaLink, FaListUl, FaListOl,
  FaQuoteRight, FaCode, FaPollH, FaQuestionCircle, FaMagic,
  FaPalette, FaTextHeight, FaAlignLeft, FaAlignCenter, FaAlignRight,
  FaEyeSlash, FaClock, FaUsers, FaLock, FaUnlock, FaStickyNote,
  FaMicrophone, FaCamera, FaCropAlt, FaDrawPolygon, FaWater,
  FaVolumeUp, FaVolumeMute, FaAdjust, FaFilter, FaBorderAll,
  FaRobot, FaLanguage, FaChartLine, FaLightbulb, FaRegClock
} from "react-icons/fa";
import axiosInstance from "../api";
import EmojiPicker from "emoji-picker-react";
import { useAuth } from "../AuthContext";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import 'react-markdown-editor-lite/lib/index.css';
import MdEditor from 'react-markdown-editor-lite';
import { SketchPicker } from 'react-color';
import { Picker } from 'emoji-mart';
// import 'emoji-mart/css/emoji-mart.css';

export default function CreatePost() {
  const { user, token } = useAuth();
  const [postType, setPostType] = useState(null);
  const [content, setContent] = useState("");
  const [markdownContent, setMarkdownContent] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [privacy, setPrivacy] = useState("public");
  const [hashtags, setHashtags] = useState("");
  const [mentions, setMentions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showTextTools, setShowTextTools] = useState(false);
  const [textFormat, setTextFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
    link: false,
    list: false,
    quote: false,
    code: false
  });
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerType, setColorPickerType] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  const [textAlign, setTextAlign] = useState('left');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isNSFW, setIsNSFW] = useState(false);
  const [hasSpoiler, setHasSpoiler] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [location, setLocation] = useState('');
  const [mood, setMood] = useState('');
  const [enableComments, setEnableComments] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [showAIHelpers, setShowAIHelpers] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGeneratedContent, setAiGeneratedContent] = useState('');
  const [showMediaTools, setShowMediaTools] = useState(false);
  const [altText, setAltText] = useState('');
  const [mediaCaption, setMediaCaption] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const emojiPickerRef = useRef(null);
  const colorPickerRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Calculate character count, word count, and reading time
  useEffect(() => {
    setCharCount(content.length);
    const words = content.trim() ? content.trim().split(/\s+/) : [];
    setWordCount(words.length);
    setReadingTime(Math.ceil(words.length / 200)); // Average reading speed
  }, [content]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (content || media) {
        saveDraft();
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [content, media]);

  // Handle clicks outside emoji picker and color picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTypeSelect = (type) => {
    if (type === "reel") {
      navigate("/createreel");
    } else {
      setPostType(type);
      setMedia(null);
      setMediaPreview(null);
    }
  };

  const handleMediaChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const validTypes = {
      image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      video: ["video/mp4", "video/webm", "video/quicktime"],
      audio: ["audio/mpeg", "audio/wav", "audio/ogg"]
    };

    // Validate file type
    const fileType = Object.keys(validTypes).find(key => 
      validTypes[key].includes(file.type)
    );
    
    if (!fileType) {
      setErrors({
        ...errors,
        media: `Unsupported file type: ${file.type}`
      });
      return;
    }

    // Update post type based on file type
    setPostType(fileType);
    setMedia(file);
    setErrors({ ...errors, media: null });

    // Create preview
    if (fileType === 'image') {
      const reader = new FileReader();
      reader.onload = (e) => setMediaPreview(e.target.result);
      reader.readAsDataURL(file);
    } else if (fileType === 'video') {
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaPreview(null);
    setAltText('');
    setMediaCaption('');
  };

  const addPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      const newOptions = [...pollOptions];
      newOptions.splice(index, 1);
      setPollOptions(newOptions);
    }
  };

  const handlePollOptionChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const saveDraft = () => {
    const draft = {
      content,
      media: media ? { name: media.name, type: media.type } : null,
      privacy,
      hashtags,
      mentions,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('postDraft', JSON.stringify(draft));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  };

  const loadDraft = () => {
    const draft = JSON.parse(localStorage.getItem('postDraft'));
    if (draft) {
      setContent(draft.content);
      setPrivacy(draft.privacy);
      setHashtags(draft.hashtags);
      setMentions(draft.mentions);
      // Note: Media would need to be re-uploaded as we can't store files in localStorage
      toast.success('Draft loaded successfully!');
    }
  };

  const generateAIContent = async () => {
    if (!aiPrompt.trim()) return;
    
    setAiLoading(true);
    try {
      // Simulate API call to AI service
      // In a real app, you would call your AI API here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response - replace with actual API response
      const mockResponse = `Here's some AI-generated content based on your prompt "${aiPrompt}":\n\n` +
        `Social media is all about connection. When you share authentic content that resonates with your audience, ` +
        `you create meaningful interactions. Consider adding a personal story or question to engage your followers.`;
      
      setAiGeneratedContent(mockResponse);
    } catch (error) {
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const applyAIContent = () => {
    if (aiGeneratedContent) {
      setContent(prev => prev + '\n\n' + aiGeneratedContent);
      setAiGeneratedContent('');
      setAiPrompt('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!content.trim() && !media && !pollQuestion && !questionText) {
      newErrors.content = "Post content, media, poll, or question is required";
    } else if (content.length > 5000) {
      newErrors.content = "Content cannot exceed 5000 characters";
    }
    
    if (showPoll && (!pollQuestion || pollOptions.some(opt => !opt.trim()))) {
      newErrors.poll = "Poll question and all options are required";
    }
    
    if (showQuestion && !questionText.trim()) {
      newErrors.question = "Question text is required";
    }
    
    if ((postType === "image" || postType === "video") && !media) {
      newErrors.media = `${postType === "image" ? "Image" : "Video"} is required`;
    }
    
    if (scheduled && (!scheduleDate || !scheduleTime)) {
      newErrors.schedule = "Please select both date and time for scheduling";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const formData = new FormData();
      
      // Required fields
      formData.append('content', content);
      formData.append('type', postType || 'text');
      formData.append('privacy', privacy);
      formData.append('isAnonymous', isAnonymous);
      formData.append('isNSFW', isNSFW);
      formData.append('hasSpoiler', hasSpoiler);
      formData.append('enableComments', enableComments);
      
      // Optional fields
      if (hashtags) formData.append('hashtags', hashtags);
      if (mentions) formData.append('mentions', mentions);
      if (location) formData.append('location', location);
      if (mood) formData.append('mood', mood);
      if (backgroundColor !== '#ffffff') formData.append('backgroundColor', backgroundColor);
      if (textColor !== '#000000') formData.append('textColor', textColor);
      if (fontSize !== 16) formData.append('fontSize', fontSize);
      if (textAlign !== 'left') formData.append('textAlign', textAlign);
      
      // Media handling
      if (media) {
        formData.append('media', media);
        if (altText) formData.append('altText', altText);
        if (mediaCaption) formData.append('mediaCaption', mediaCaption);
      }
      
      // Poll data
      if (showPoll) {
        formData.append('pollQuestion', pollQuestion);
        formData.append('pollOptions', JSON.stringify(pollOptions.filter(opt => opt.trim())));
      }
      
      // Question data
      if (showQuestion) {
        formData.append('questionText', questionText);
      }
      
      // Scheduled post
      if (scheduled && scheduleDate && scheduleTime) {
        const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
        formData.append('scheduledAt', scheduledDateTime.toISOString());
      }

      const response = await axiosInstance.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        timeout: 10000
      });
      
      if (response.data.success) {
        toast.success('Post created successfully!');
        // Clear draft on successful post
        localStorage.removeItem('postDraft');
        navigate('/');
      } else {
        throw new Error(response.data.message || 'Failed to create post');
      }
      
    } catch (error) {
      console.error('Error creating post:', error);
      let errorMessage = 'Failed to create post';
      if (error.response) {
        if (error.response.data?.errors) {
          setErrors(error.response.data.errors);
        }
        errorMessage = error.response.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTextFormat = (format) => {
    setTextFormat(prev => ({
      ...prev,
      [format]: !prev[format]
    }));
    
    // Apply basic formatting to the content
    const textarea = document.querySelector('textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let newText = content;
    
    switch (format) {
      case 'bold':
        newText = content.substring(0, start) + `**${selectedText}**` + content.substring(end);
        break;
      case 'italic':
        newText = content.substring(0, start) + `*${selectedText}*` + content.substring(end);
        break;
      case 'underline':
        newText = content.substring(0, start) + `<u>${selectedText}</u>` + content.substring(end);
        break;
      case 'link':
        newText = content.substring(0, start) + `[${selectedText}](url)` + content.substring(end);
        break;
      case 'list':
        newText = content.substring(0, start) + `\n- ${selectedText}` + content.substring(end);
        break;
      case 'quote':
        newText = content.substring(0, start) + `> ${selectedText}` + content.substring(end);
        break;
      case 'code':
        newText = content.substring(0, start) + `\`${selectedText}\`` + content.substring(end);
        break;
      default:
        break;
    }
    
    setContent(newText);
    
    // Return focus to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, end + 2);
    }, 0);
  };

  const handleEditorChange = ({ html, text }) => {
    setMarkdownContent(text);
  };

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-pink-600">Create Post</h2>

        {Object.keys(errors).length > 0 && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
            {Object.values(errors).map((error, i) => (
              <div key={i} className="flex items-center">
                <FaExclamationCircle className="mr-2" />
                {error}
              </div>
            ))}
          </div>
        )}

        {!postType && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {[
              { icon: <FaFont size={24} />, label: "Text", type: "text" },
              { icon: <FaImage size={24} />, label: "Image", type: "image" },
              { icon: <FaVideo size={24} />, label: "Video", type: "video" },
              { icon: <FaMusic size={24} />, label: "Audio", type: "audio" },
              { icon: <FaFilm size={24} />, label: "Reel", type: "reel" },
              { icon: <FaPollH size={24} />, label: "Poll", type: "poll" },
              { icon: <FaQuestionCircle size={24} />, label: "Question", type: "question" },
              { icon: <FaStickyNote size={24} />, label: "Note", type: "note" },
              { icon: <FaQuoteRight size={24} />, label: "Quote", type: "quote" },
            ].map(({ icon, label, type }) => (
              <button
                key={type}
                onClick={() => {
                  if (type === 'poll') {
                    setShowPoll(true);
                    setPostType('text');
                  } else if (type === 'question') {
                    setShowQuestion(true);
                    setPostType('text');
                  } else {
                    handleTypeSelect(type);
                  }
                }}
                className="flex flex-col items-center p-4 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/20 transition"
              >
                <div className="text-pink-500 mb-2">{icon}</div>
                <span className="text-gray-800 dark:text-gray-200">{label}</span>
              </button>
            ))}
          </div>
        )}

        {postType && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowTextTools(!showTextTools)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Text formatting"
                >
                  <FaTextHeight />
                </button>
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Color options"
                >
                  <FaPalette />
                </button>
                <button
                  type="button"
                  onClick={() => setShowAIHelpers(!showAIHelpers)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="AI Assistant"
                >
                  <FaRobot />
                </button>
              </div>
              <div className="text-sm text-gray-500">
                {wordCount} words • {readingTime} min read
              </div>
            </div>

            {showTextTools && (
              <div className="flex flex-wrap gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-3">
                <button
                  type="button"
                  onClick={() => toggleTextFormat('bold')}
                  className={`p-2 rounded ${textFormat.bold ? 'bg-pink-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  title="Bold"
                >
                  <FaBold />
                </button>
                <button
                  type="button"
                  onClick={() => toggleTextFormat('italic')}
                  className={`p-2 rounded ${textFormat.italic ? 'bg-pink-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  title="Italic"
                >
                  <FaItalic />
                </button>
                <button
                  type="button"
                  onClick={() => toggleTextFormat('underline')}
                  className={`p-2 rounded ${textFormat.underline ? 'bg-pink-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  title="Underline"
                >
                  <FaUnderline />
                </button>
                <button
                  type="button"
                  onClick={() => toggleTextFormat('link')}
                  className={`p-2 rounded ${textFormat.link ? 'bg-pink-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  title="Link"
                >
                  <FaLink />
                </button>
                <button
                  type="button"
                  onClick={() => toggleTextFormat('list')}
                  className={`p-2 rounded ${textFormat.list ? 'bg-pink-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  title="List"
                >
                  <FaListUl />
                </button>
                <button
                  type="button"
                  onClick={() => toggleTextFormat('quote')}
                  className={`p-2 rounded ${textFormat.quote ? 'bg-pink-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  title="Quote"
                >
                  <FaQuoteRight />
                </button>
                <button
                  type="button"
                  onClick={() => toggleTextFormat('code')}
                  className={`p-2 rounded ${textFormat.code ? 'bg-pink-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  title="Code"
                >
                  <FaCode />
                </button>
                <select
                  value={textAlign}
                  onChange={(e) => setTextAlign(e.target.value)}
                  className="p-2 bg-white dark:bg-gray-600 rounded border border-gray-300 dark:border-gray-500"
                >
                  <option value="left"><FaAlignLeft title="Align left" /></option>
                  <option value="center"><FaAlignCenter title="Align center" /></option>
                  <option value="right"><FaAlignRight title="Align right" /></option>
                </select>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="p-2 bg-white dark:bg-gray-600 rounded border border-gray-300 dark:border-gray-500"
                >
                  <option value="14">Small</option>
                  <option value="16">Normal</option>
                  <option value="18">Large</option>
                  <option value="20">Extra Large</option>
                </select>
              </div>
            )}

            {showColorPicker && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Background Color</label>
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                      style={{ backgroundColor }}
                      onClick={() => {
                        setColorPickerType('background');
                        setShowColorPicker(true);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setBackgroundColor('#ffffff')}
                      className="ml-2 text-sm text-pink-500"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Text Color</label>
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                      style={{ backgroundColor: textColor }}
                      onClick={() => {
                        setColorPickerType('text');
                        setShowColorPicker(true);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setTextColor('#000000')}
                      className="ml-2 text-sm text-pink-500"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                {colorPickerType && (
                  <div ref={colorPickerRef} className="absolute z-10 mt-2">
                    <SketchPicker
                      color={colorPickerType === 'background' ? backgroundColor : textColor}
                      onChangeComplete={(color) => {
                        if (colorPickerType === 'background') {
                          setBackgroundColor(color.hex);
                        } else {
                          setTextColor(color.hex);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {showAIHelpers && (
              <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                  <FaMagic className="mr-2 text-pink-500" /> AI Content Assistant
                </h3>
                <textarea
                  className="w-full p-2 mb-2 border rounded-lg dark:bg-gray-600 dark:text-white"
                  placeholder="Describe what you want to post about..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={generateAIContent}
                    disabled={aiLoading}
                    className="px-3 py-1 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center"
                  >
                    {aiLoading ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        Generating...
                      </>
                    ) : (
                      "Generate Content"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAIHelpers(false)}
                    className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded-lg"
                  >
                    Close
                  </button>
                </div>
                {aiGeneratedContent && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">AI Suggestion:</h4>
                      <button
                        type="button"
                        onClick={applyAIContent}
                        className="text-sm bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300 px-2 py-1 rounded"
                      >
                        Apply
                      </button>
                    </div>
                    <p className="text-sm">{aiGeneratedContent}</p>
                  </div>
                )}
              </div>
            )}

            <div 
              className="relative rounded-lg p-4 mb-4 transition-all"
              style={{
                backgroundColor,
                color: textColor,
                fontSize: `${fontSize}px`,
                textAlign,
                minHeight: '200px'
              }}
            >
              {showPreview ? (
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[gfm]}>{content}</ReactMarkdown>
                </div>
              ) : (
                <>
                  <textarea
                    className={`w-full p-3 bg-transparent resize-none focus:outline-none ${
                      errors.content ? "border-red-500" : "border-transparent"
                    }`}
                    placeholder="What's on your mind?"
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{
                      color: textColor,
                      fontSize: `${fontSize}px`,
                      textAlign,
                      minHeight: '150px'
                    }}
                  />
                  <div className={`absolute bottom-2 right-2 text-xs ${
                    charCount > 4500 ? "text-red-500" : "text-gray-500"
                  }`}>
                    {charCount}/5000
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm"
              >
                {showPreview ? "Edit" : "Preview"}
              </button>
              <button
                type="button"
                onClick={saveDraft}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm flex items-center"
              >
                {draftSaved ? (
                  <>
                    <FaCheck className="mr-1 text-green-500" /> Saved!
                  </>
                ) : (
                  "Save Draft"
                )}
              </button>
              <button
                type="button"
                onClick={loadDraft}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm"
              >
                Load Draft
              </button>
            </div>

            {(postType === "image" || postType === "video") && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">
                    {postType === "image" ? "Image" : "Video"} Upload
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowMediaTools(!showMediaTools)}
                    className="text-sm text-pink-500"
                  >
                    {showMediaTools ? "Hide Tools" : "Show Tools"}
                  </button>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  accept={postType === "image" ? "image/*" : "video/*"}
                  onChange={handleMediaChange}
                  className="hidden"
                />
                
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={openFilePicker}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm"
                  >
                    {postType === "image" ? "Upload Image" : "Upload Video"}
                  </button>
                  {postType === "image" && (
                    <button
                      type="button"
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm flex items-center"
                      title="Take photo"
                    >
                      <FaCamera className="mr-1" /> Camera
                    </button>
                  )}
                </div>
                
                {showMediaTools && (
                  <div className="grid grid-cols-2 gap-3 mb-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div>
                      <label className="block mb-1 text-sm font-medium">Alt Text</label>
                      <input
                        type="text"
                        placeholder="Description for accessibility"
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        className="w-full p-2 text-sm border rounded-lg dark:bg-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">Caption</label>
                      <input
                        type="text"
                        placeholder="Media caption"
                        value={mediaCaption}
                        onChange={(e) => setMediaCaption(e.target.value)}
                        className="w-full p-2 text-sm border rounded-lg dark:bg-gray-600 dark:text-white"
                      />
                    </div>
                    {postType === "image" && (
                      <>
                        <button
                          type="button"
                          className="flex items-center gap-1 p-2 bg-white dark:bg-gray-600 rounded text-sm"
                        >
                          <FaCropAlt /> Crop
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-1 p-2 bg-white dark:bg-gray-600 rounded text-sm"
                        >
                          <FaFilter /> Filters
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-1 p-2 bg-white dark:bg-gray-600 rounded text-sm"
                        >
                          <FaDrawPolygon /> Draw
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-1 p-2 bg-white dark:bg-gray-600 rounded text-sm"
                        >
                          <FaWater /> Watermark
                        </button>
                      </>
                    )}
                    {postType === "video" && (
                      <>
                        <button
                          type="button"
                          className="flex items-center gap-1 p-2 bg-white dark:bg-gray-600 rounded text-sm"
                        >
                          <FaVolumeUp /> Audio
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-1 p-2 bg-white dark:bg-gray-600 rounded text-sm"
                        >
                          <FaAdjust /> Trim
                        </button>
                      </>
                    )}
                  </div>
                )}
                
                {mediaPreview && (
                  <div className="mt-2 relative group">
                    {postType === "image" ? (
                      <img 
                        src={mediaPreview} 
                        alt="Preview" 
                        className="max-h-80 w-auto rounded-lg"
                      />
                    ) : (
                      <video
                        src={mediaPreview}
                        controls
                        className="max-h-80 w-auto rounded-lg"
                      />
                    )}
                    <button
                      type="button"
                      onClick={removeMedia}
                      className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black transition"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>
            )}

            {showPoll && (
              <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium mb-3 flex items-center">
                  <FaPollH className="mr-2 text-pink-500" /> Create Poll
                </h3>
                <div className="mb-3">
                  <label className="block mb-1 text-sm font-medium">Poll Question</label>
                  <input
                    type="text"
                    placeholder="Ask your question..."
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-600 dark:text-white"
                  />
                </div>
                <div className="space-y-2 mb-3">
                  <label className="block text-sm font-medium">Options</label>
                  {pollOptions.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => handlePollOptionChange(index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg dark:bg-gray-600 dark:text-white"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removePollOption(index)}
                          className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {pollOptions.length < 6 && (
                  <button
                    type="button"
                    onClick={addPollOption}
                    className="text-sm text-pink-500 hover:underline"
                  >
                    + Add Option
                  </button>
                )}
                <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={enableComments}
                      onChange={(e) => setEnableComments(e.target.checked)}
                    />
                    Allow comments on this poll
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPoll(false)}
                  className="mt-3 text-sm text-red-500 hover:underline"
                >
                  Remove Poll
                </button>
              </div>
            )}

            {showQuestion && (
              <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium mb-3 flex items-center">
                  <FaQuestionCircle className="mr-2 text-pink-500" /> Ask a Question
                </h3>
                <div className="mb-3">
                  <label className="block mb-1 text-sm font-medium">Your Question</label>
                  <textarea
                    placeholder="What would you like to ask?"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-600 dark:text-white"
                    rows={3}
                  />
                </div>
                <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={enableComments}
                      onChange={(e) => setEnableComments(e.target.checked)}
                    />
                    Allow answers to this question
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowQuestion(false)}
                  className="mt-3 text-sm text-red-500 hover:underline"
                >
                  Remove Question
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="flex items-center mb-1 text-sm font-medium">
                  <FaHashtag className="mr-1 text-pink-500" />
                  Hashtags
                </label>
                <input
                  type="text"
                  placeholder="#fun #travel (separate with spaces)"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="flex items-center mb-1 text-sm font-medium">
                  <FaAt className="mr-1 text-pink-500" />
                  Mentions
                </label>
                <input
                  type="text"
                  placeholder="@friend @user (separate with spaces)"
                  value={mentions}
                  onChange={(e) => setMentions(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="flex items-center mb-1 text-sm font-medium">
                  <FaMapMarkerAlt className="mr-1 text-pink-500" />
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Add location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="flex items-center mb-1 text-sm font-medium">
                  <FaSmile className="mr-1 text-pink-500" />
                  Mood
                </label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select mood</option>
                  <option value="happy">😊 Happy</option>
                  <option value="excited">🤩 Excited</option>
                  <option value="thoughtful">🤔 Thoughtful</option>
                  <option value="sad">😢 Sad</option>
                  <option value="angry">😠 Angry</option>
                  <option value="loved">🥰 Loved</option>
                  <option value="grateful">🙏 Grateful</option>
                  <option value="silly">🤪 Silly</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Privacy</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPrivacy("public")}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
                    privacy === "public" 
                      ? "bg-pink-600 text-white" 
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <FaGlobe /> Public
                </button>
                <button
                  type="button"
                  onClick={() => setPrivacy("friends")}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
                    privacy === "friends" 
                      ? "bg-pink-600 text-white" 
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <FaUsers /> Friends
                </button>
                <button
                  type="button"
                  onClick={() => setPrivacy("private")}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
                    privacy === "private" 
                      ? "bg-pink-600 text-white" 
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <FaLock /> Private
                </button>
              </div>
            </div>

            <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Advanced Options</h3>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-sm text-pink-500"
                >
                  {showAdvanced ? "Hide" : "Show"}
                </button>
              </div>
              
              {showAdvanced && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                      />
                      Post anonymously
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isNSFW}
                        onChange={(e) => setIsNSFW(e.target.checked)}
                      />
                      NSFW content
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={hasSpoiler}
                        onChange={(e) => setHasSpoiler(e.target.checked)}
                      />
                      Contains spoiler
                    </label>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-300 dark:border-gray-600">
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={scheduled}
                        onChange={(e) => setScheduled(e.target.checked)}
                      />
                      Schedule this post
                    </label>
                    {scheduled && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm">Date</label>
                          <input
                            type="date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full p-2 border rounded-lg dark:bg-gray-600 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm">Time</label>
                          <input
                            type="time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            className="w-full p-2 border rounded-lg dark:bg-gray-600 dark:text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-2 border-t border-gray-300 dark:border-gray-600">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={enableComments}
                        onChange={(e) => setEnableComments(e.target.checked)}
                      />
                      Allow comments
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setPostType(null);
                  setShowPoll(false);
                  setShowQuestion(false);
                }}
                className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
                disabled={isLoading}
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    {scheduled ? "Scheduling..." : "Posting..."}
                  </>
                ) : scheduled ? (
                  "Schedule Post"
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}