// js/research.js

document.addEventListener('DOMContentLoaded', () => {
  loadResearch();
});

async function loadResearch() {
  const container = document.getElementById('research-list');
  if (!container) return;

  try {
    const response = await fetch('../../data/research.json');
    if (!response.ok) {
      throw new Error(`Failed to load research.json: ${response.status}`);
    }
    const data = await response.json();
    renderResearch(container, data.categories || []);
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p class="research-error">Failed to load research data. Please try again later.</p>';
  }
}

function renderResearch(container, categories) {
  container.innerHTML = '';

  categories.forEach((category) => {
    const section = document.createElement('section');
    section.className = 'research-section';

    const hasTopics = Array.isArray(category.topics) && category.topics.length > 0;

    // ----- Section header -----
    const header = document.createElement('div');
    header.className = 'research-section-header';

    const titleEl = document.createElement('h2');
    titleEl.className = 'research-section-title';
    titleEl.textContent = category.title;

    header.appendChild(titleEl);

    // 소주제가 있는 경우에만 헤더에 설명을 넣는다.
    if (hasTopics) {
      const descEl = document.createElement('p');
      descEl.className = 'research-section-description';
      descEl.textContent = category.description;
      header.appendChild(descEl);
    }

    section.appendChild(header);

    // ----- Topics / Single block -----
    const topicsWrapper = document.createElement('div');
    topicsWrapper.className = 'research-topics';

    if (hasTopics) {
      category.topics.forEach((topic) => {
        const topicEl = createTopicElement(topic);
        topicsWrapper.appendChild(topicEl);
      });
    } else {
      // 소주제가 없으면: 제목은 위 헤더에만, 카드는 "이미지 + 설명"만 표시
      const topicEl = createTopicElement({
        title: '', // 내부 카드에는 제목을 안 넣음
        description: category.description,
        media: category.media || category.image || '',
        media_reference: category.media_reference || ''
      });
      topicEl.classList.add('research-topic-single');
      topicsWrapper.appendChild(topicEl);
    }

    section.appendChild(topicsWrapper);
    container.appendChild(section);
  });
}

function createTopicElement(topic) {
  const topicEl = document.createElement('div');
  topicEl.className = 'research-topic';

  // --- Media wrapper ---
  const mediaWrapper = document.createElement('div');
  mediaWrapper.className = 'research-topic-media';

  const mediaName = (topic.media || topic.image || '').trim();

  if (mediaName) {
    const mediaPath = '../../assets/' + mediaName;

    // MP4 video
    if (mediaName.toLowerCase().endsWith('.mp4')) {
      const video = document.createElement('video');
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.className = 'research-topic-video';

      const source = document.createElement('source');
      source.src = mediaPath;
      source.type = 'video/mp4';

      video.appendChild(source);
      mediaWrapper.appendChild(video);
    } else {
      // Image (jpg/png/gif)
      const img = document.createElement('img');
      img.src = mediaPath;
      img.alt = topic.title || 'Research media';
      img.className = 'research-topic-image';
      mediaWrapper.appendChild(img);
    }
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'research-topic-media-placeholder';
    placeholder.textContent = 'Media';
    mediaWrapper.appendChild(placeholder);
  }

  // --- Text content ---
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'research-topic-content';

  if (topic.title && topic.title.trim() !== "") {
    const titleEl = document.createElement('h3');
    titleEl.className = 'research-topic-title';
    titleEl.textContent = topic.title;
    contentWrapper.appendChild(titleEl);
  }

  const descEl = document.createElement('p');
  descEl.className = 'research-topic-description';
  descEl.textContent = topic.description || '';
  contentWrapper.appendChild(descEl);

  // 🔥 Reference 버튼: description 아래에 둥근 버튼으로 추가
  if (topic.media_reference) {
    const refBtn = document.createElement('a');
    refBtn.href = topic.media_reference;
    refBtn.target = '_blank';
    refBtn.rel = 'noopener noreferrer';
    refBtn.className = 'media-reference-pill';
    refBtn.textContent = 'Image/Video Reference';
    contentWrapper.appendChild(refBtn);
  }

  topicEl.appendChild(mediaWrapper);
  topicEl.appendChild(contentWrapper);

  return topicEl;
}
