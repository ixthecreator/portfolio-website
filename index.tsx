import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import { LayoutGrid, AlignLeft, Search, ArrowLeft, ArrowRight, X, Maximize2, Minimize2, Share2, Copy, Check, Moon, Sun, Filter, Instagram, Twitter } from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface Work {
  id: string;
  title: string;
  titleEn?: string; // 英文标题（可选）
  year: string;
  series: string;
  seriesEn?: string; // 英文系列名（可选）
  media: string;
  mediaEn?: string; // 英文材质（可选）
  dimensions: string;
  synopsis: string;
  synopsisEn?: string; // 英文简介（可选）
  imageUrl: string;
  videoUrl?: string; // 视频URL（可选）
  category: 'experiments' | 'selected-works'; // 作品分类
}

type Language = 'zh' | 'en';

// --- CONFIGURATION & DATA ---

// Define colors for specific series
// The order of keys here also determines the display order in Text View
const SERIES_COLORS: Record<string, string> = {
  // A. Installation（装置类）
  'LED Text Installation': '#000000',              // Black
  'LED文字装置': '#000000',                        // Black (Chinese)
  'Interactive Installation': '#94a3b8',           // Silver/Slate
  '互动装置': '#94a3b8',                          // Silver/Slate (Chinese)
  'Multimedium Installation': '#ea580c',           // Orange
  '多媒体装置': '#ea580c',                        // Orange (Chinese)
  // B. Digital Works（数位作品）
  'Digital Moving Image': '#ef4444',              // Red
  '数位影像': '#ef4444',                          // Red (Chinese)
  'Digital Collage': '#65a30d',                   // Green
  '数位拼贴': '#65a30d',                          // Green (Chinese)
  // C. Projection / Mixed Media（投影 / 混合媒材）
  'Projection / Mixed Media': '#8b5cf6',           // Purple
  '投影 / 混合媒材': '#8b5cf6',                    // Purple (Chinese)
  'Uncategorized': '#737373',                     // Grey
  '未分类': '#737373',                            // Grey (Chinese)
};

// Translations
const translations = {
  zh: {
    selectedWorks: '精选作品',
    experiments: '实验作品',
    sortBy: '排序方式',
    series: '系列',
    year: '年份',
    previous: '上一个',
    next: '下一个',
    workNotFound: '作品未找到',
    medium: '材质',
    dimensions: '尺寸',
    filter: '筛选',
    allSeries: '所有系列',
    allYears: '所有年份',
    darkMode: '深色模式',
    lightMode: '浅色模式',
  },
  en: {
    selectedWorks: 'Selected Works',
    experiments: 'Experiments',
    sortBy: 'Sort by',
    series: 'Series',
    year: 'Year',
    previous: 'Previous',
    next: 'Next',
    workNotFound: 'Work not found',
    medium: 'Medium',
    dimensions: 'Dimensions',
    filter: 'Filter',
    allSeries: 'All Series',
    allYears: 'All Years',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
  }
};

// Works Data - Organized by Category/Medium Order
const WORKS: Work[] = [
  // A. Installation（装置类）
  // 1. LED Text Installation
  {
    id: '1',
    title: 'TRUISMS PROVE THERE ARE NO TRUISMS',
    titleEn: 'TRUISMS PROVE THERE ARE NO TRUISMS',
    year: '2024',
    series: 'LED文字装置',
    seriesEn: 'LED Text Installation',
    media: 'LED Matrix with stainless steel box',
    mediaEn: 'LED Matrix with stainless steel box',
    dimensions: '180 × 26 × 6 cm',
    synopsis: '作为"精选作品"系列中的代表作之一，《TRUISMS PROVE THERE ARE NO TRUISMS》以实时运算的 LED 装置重新诠释了 Jenny Holzer 的文字艺术传统，尤其是其奠基性的《Truisms》（1978–1987）。作品提出一条新的元箴言："Truisms 证明世上并无 Truisms。"文本在 LED 上被重复 253 次，精确对应 Holzer 原作的箴言数量。第一轮滚动以 19.78 秒呈现，象征 1978 年的起点；其后每一次以 1.253 倍速度加快，使后半段文本逐渐崩解为难以辨认的闪烁。意义在重复中瓦解的过程在此被视觉化，形成对"真理"概念的反思。不同于传统预渲染视频，作品由自主编写的程序实时驱动，计算滚动速度、位移与循环结构，使 LED 不仅是显示媒介，更是一个持续运算、生成自身节奏与视觉逻辑的系统。不锈钢外壳呼应了 Holzer 冷峻、工业性的美学，同时强化作品的物理存在。这件作品既是致敬，也是批评——在延续 Holzer 影响的同时，也探讨了在当代信息循环中"真理"的不稳定性。',
    synopsisEn: 'TRUISMS PROVE THERE ARE NO TRUISMS is a selected work that reinterprets Jenny Holzer\'s foundational text-based practice through a real-time generative LED installation. Drawing from Holzer\'s influence—particularly her Truisms series (1978–1987)—the piece constructs a new meta-truism: "Truisms prove that there are no Truisms." The sentence repeats 253 times, directly corresponding to the number of statements in Holzer\'s original list. The first cycle scrolls across the matrix in 19.78 seconds, referencing 1978, while each subsequent repetition accelerates by a factor of 1.253, causing the final iterations to break down into nearly unreadable flashes. This transformation from clarity to collapse visualizes how ideology, when endlessly circulated, dissolves into noise and loses meaning. Unlike pre-rendered LED videos, the work operates through a custom-written control program that calculates speed progression, positional updates, and loop behavior in real time. The LED matrix becomes an active system rather than a passive screen—continuously generating its own temporal rhythms and visual logic. Housed in a stainless-steel enclosure, the piece echoes Holzer\'s industrial aesthetic while asserting its own computational agency. This work stands as both homage and critique: honoring Holzer\'s legacy while exploring the instability of truth in a world saturated with repetition.',
    imageUrl: '/images/truisms-prove/truisms-prove-1.jpg',
    category: 'selected-works'
  },
  {
    id: '2',
    title: '我真的成為怪物了嗎',
    titleEn: 'HAVE I TRULY BECOME A MONSTER',
    year: '2024',
    series: 'LED文字装置',
    seriesEn: 'LED Text Installation',
    media: 'LED 模组，定制不锈钢外壳，自主开发控制系统',
    mediaEn: 'LED Matrix with stainless steel enclosure, custom control system',
    dimensions: '180 × 26 × 6 cm',
    synopsis: '作品灵感来自 Jenny Holzer 的巨型文字灯箱装置。本作以手工焊接的不锈钢结构与自主编写的 LED 控制系统，将文字转化为一种无法被忽视的实体存在。屏幕循环播放的句子——「我真的成為怪物了嗎？」——指向艺术家长期以来对"变化"与"疏离"的焦虑。这里的"怪物"象征被社会边缘化的人，以及一种更深层的恐惧：是否正在慢慢变成自己曾经最讨厌的那种"成人"。LED 媒介本身具有强制观看的特性，明亮、直白、无可逃避。文字瞬间在观者脑中浮现，也提醒着语言如何潜移默化地塑造我们。作品采用复古点阵风格，令人联想到早期 RPG 游戏，使情绪张力以童话式、任务式的方式呈现——主角仿佛是拼命抵抗变形的孩子。使用繁体中文呈现文本，则保留了语言的暧昧性，也强化了作品的开放解读空间。',
    synopsisEn: 'Inspired by Jenny Holzer\'s monumental text installations, this work transforms language into an unavoidable physical presence through a hand-welded stainless-steel enclosure and a custom-coded LED matrix system. The displayed sentence—"我真的成為怪物了嗎？" (Have I truly become a monster?)—captures the artist\'s long-standing anxiety about social alienation and the subtle ways society reshapes individuals. Here, "monster" symbolizes an outsider who can no longer integrate, as well as the fear of becoming the kind of adult one once rejected. The LED matrix medium reinforces this tension: bright, confrontational, and impossible to ignore. Text appears in the viewer\'s mind involuntarily—a reminder that language infiltrates us subconsciously. Using a retro dot-matrix aesthetic reminiscent of early RPGs, the work frames this psychological struggle like a mythic quest. The protagonist resembles a child-hero resisting unwanted transformation. The choice to display the text in Traditional Chinese preserves nuance and embraces the ambiguity that meaningfully shapes the viewer\'s interpretation.',
    imageUrl: '/images/have-i-truly-become-monster/have-i-truly-become-monster-1.jpg',
    category: 'selected-works'
  },
  {
    id: '3',
    title: '姐姐/今夜我不關心人類',
    titleEn: 'Sister / Tonight I Don\'t Care About Humanity',
    year: '2025',
    series: 'LED文字装置',
    seriesEn: 'LED Text Installation',
    media: 'LED Matrix with stainless steel box',
    mediaEn: 'LED Matrix with stainless steel box',
    dimensions: '180 cm × 26 cm × 6 cm',
    synopsis: '《姐姐 / 今夜我不關心人類》将手写般的蓝白文字置于超长比例的 LED 矩阵之上，以失焦、噪点、闪烁等视觉特征模拟语言在数字系统中的崩解和漂流。原本用于传递清晰信息的显示装置，在此成为情绪的噪声放大器：文字被系统拉伸、扭曲、重影，呈现出一种数字化的疲惫感与暂时撤离世界的姿态。作品探索个体在信息洪流中的位置，呈现当代人类情绪在技术结构中被放大、误读、稀释的状态。通过"故障式语言"，作品揭示情感在高度系统化社会中的不可控流动与被动暴露。',
    synopsisEn: 'Elder Sister / Tonight I Do Not Care About Humanity places handwritten, glowing blue-and-white script across an elongated LED matrix, using blur, pixel noise, and flicker to evoke the breakdown and drift of language within digital systems. A medium designed for clarity becomes a carrier of emotional distortion: the text stretches, smears, and ghosts, manifesting a sense of digital exhaustion and a temporary withdrawal from the world. The work considers the individual\'s place within an overwhelming information ecology, revealing how human emotion becomes amplified, misread, or dissolved within technological infrastructures. Through a visual language of "glitch," the piece reflects the unstable circulation and involuntary exposure of feeling in a highly systematized era.',
    imageUrl: '/images/sister-tonight-i-dont-care/sister-1.jpg',
    videoUrl: '/images/sister-tonight-i-dont-care/Humanity-1_Final.mp4',
    category: 'selected-works'
  },
  // 2. Interactive Installation
  {
    id: '4',
    title: 'media{loop}',
    titleEn: 'media{loop}',
    year: '2025',
    series: '互动装置',
    seriesEn: 'Interactive Installation',
    media: '双屏互动装置；Python、MediaPipe 姿态追踪、VL53L1X 距离传感器、HDMI 分屏显示与石膏基座',
    mediaEn: 'Dual-screen installation; Python, MediaPipe body-tracking, VL53L1X distance sensor, HDMI-split display on plaster pedestal',
    dimensions: 'Variable dimensions',
    synopsis: '《media{loop》作为 3l / atlas 事件 系列中的 "视差证物 01 号"，将观众的身体采集为数据，再以两份略微错位的影像回路形式返还。通过距离感应与实时姿态追踪，观众的靠近、停顿与细微动作会触发画面偏移与时间差。两块屏幕像是来自不同专家系统的技术报告：处理的是同一个身体，却给出相互矛盾的"证据"。作品呼应 3l / atlas 事件中无法统一的多重证词，揭示了技术见证并非呈现真相，而是在制造多个相互不兼容的"在场版本"。',
    synopsisEn: 'media{loop} serves as Parallax Evidence No. 01 within the 3l / atlas Incident series. The installation captures the viewer\'s body as data and returns it as two subtly diverging visual outputs. Through distance sensing and real-time pose tracking, proximity and micro-movements generate shifting patterns and temporal offsets. Each screen behaves like a different expert system—processing the same body, yet producing contradictory "proof." The work echoes the unstable testimonies surrounding the 3l / atlas event, revealing how technical witnesses—algorithms, sensors, and imaging devices—do not present truth but manufacture multiple incompatible versions of presence.',
    imageUrl: '/images/media{loop}/media-loop-1.png',
    category: 'selected-works'
  },
  // 3. Multimedium Installation
  {
    id: '5',
    title: 'Void → Radiance',
    titleEn: 'Void → Radiance',
    year: '2024',
    series: '多媒体装置',
    seriesEn: 'Multimedium Installation',
    media: 'Multimedium installation (acrylic plexiglass, watercolor board, aluminum foil, plywood)',
    mediaEn: 'Multimedium installation (acrylic plexiglass, watercolor board, aluminum foil, plywood)',
    dimensions: '16 × 18.5 in',
    synopsis: '《Void → Radiance》呈现了艺术家在疫情期间的心理跃迁——从虚无、麻木与停滞中挣脱，迈向清醒与存在主义式的觉醒。左侧面具以扩散的蓝绿水彩描绘，并被透明亚克力覆盖，象征隔离时期的疏离、迷惘，以及 Sylvia Plath《Ariel》中"无实体的蓝色"所指向的超现实精神状态。那层透明却无法移除的材料如同自我与外界之间的屏障。右侧面具以反光铝箔包覆，象征突破、重生与精神上的升华。额头的竖眼取自神话人物二郎神，寓意能洞穿黑暗的启示性视野。双面具的叠合记录了一个转瞬的临界点——自我从虚空中浮现，走向光亮。',
    synopsisEn: 'Void → Radiance visualizes the artist\'s psychological transition during the pandemic—from emotional numbness and nihilistic stagnation to a renewed sense of clarity and existential awakening. The left mask, painted in diffused blues and greens beneath an acrylic sheet, embodies isolation, disorientation, and the "substanceless blue" evoked in Sylvia Plath\'s Ariel. The acrylic layer becomes a fragile yet immovable barrier mirroring the distance between self and world. The right mask, covered in reflective aluminum foil, symbolizes transcendence, rebirth, and the emergence of a sharpened inner vision. The vertically placed eye—referencing the mythological third eye of Yang Jian—signals enlightenment piercing through former darkness. Together, the overlapping masks illustrate a self rising from void into radiance.',
    imageUrl: '/images/void-radiance/void-radiance-1.jpg',
    category: 'selected-works'
  },
  {
    id: '6',
    title: 'Human | Flawed Machine',
    titleEn: 'Human | Flawed Machine',
    year: '2024',
    series: '多媒体装置',
    seriesEn: 'Multimedium Installation',
    media: 'Multimedium installation',
    mediaEn: 'Multimedium installation',
    dimensions: '16 × 23 in',
    synopsis: '《Human | Flawed Machine》以"人如机器"的隐喻重新诠释自画像。金属圆环标记面部穴位，红黑绝缘线在其间构成脆弱的"电路"。暴露的铜线、松散的节点与以白色胶带修补的痕迹皆为刻意保留，象征人类与生俱来的缺陷与无法彻底修复的脆弱。拼贴的双眼与嘴唇穿插于机械结构之间，呈现被困于系统中的意识，努力观看、发声，却仍受限于结构本身。镜面让观者同时成为作品的一部分，使"身份"成为被折射与不断重构的议题。作品结合中医穴位的象征语言与 Tony Oursler 式的诡异视觉风格，将身份描绘为在机械逻辑与人类脆弱之间持续纠缠的存在。',
    synopsisEn: 'Human | Flawed Machine reinterprets the self-portrait through the metaphor of the human body as a malfunctioning machine. Metal rings mark acupuncture points across the face, while red-and-black insulated wires form a network of fragile "circuits." The intentionally unpolished joints—exposed copper, loose ends, and temporary white repair tape—reveal the inherent flaws embedded within human existence. Collaged eyes and lips interrupt the mechanical network, introducing a trapped awareness struggling to see and speak through a rigid structure. The mirror surface reflects the viewer back into the piece, reinforcing the work\'s investigation of identity, self-repair, and the impossibility of achieving perfection. Blending references from traditional Chinese medicine with the eerie figural language of Tony Oursler, the work positions identity as a perpetual negotiation between systemized structure and human vulnerability.',
    imageUrl: '/images/human-flawed-machine/human-flawed-machine-main.png',
    category: 'selected-works'
  },
  // B. Digital Works（数位作品）
  // 1. Digital Moving Image
  {
    id: '7',
    title: 'Wind Fragments',
    titleEn: 'Wind Fragments',
    year: '2025',
    series: '数位影像',
    seriesEn: 'Digital Moving Image',
    media: 'Video installation (split-screen)',
    mediaEn: 'Video installation (split-screen)',
    dimensions: '3840 × 2160, 1\'33"',
    synopsis: '《Wind Fragments》是一部分屏影像作品，以无脸的身影穿行于春日景色为线索。左屏的极简动作——步伐、停顿、触碰——在右屏化为自然的回应：花瓣漂浮、枝叶轻颤、水波闪动。两者形成无声对话，构建出一个轻盈、柔粉、介于"空气与真空"之间的空间，指向：即使宏大的旅程已结束，世界最细微的回响也足以让人继续向前。',
    synopsisEn: 'Wind Fragments is a split-screen video that follows a faceless figure wandering through spring landscapes. Minimal gestures on the left—walking, pausing, touching—quietly echo through natural reactions on the right: drifting petals, trembling branches, moving water. This visual dialogue forms a weightless, pastel-toned space "between air and vacuum," suggesting that even after a grand journey ends, the world\'s smallest responses can offer a reason to keep moving.',
    imageUrl: 'https://images.unsplash.com/photo-1629836528731-9a7444c5f932?q=80&w=2070&auto=format&fit=crop',
    category: 'selected-works'
  },
  // 2. Digital Collage
  {
    id: '8',
    title: 'Signal / Noise: Buddha Series',
    titleEn: 'Signal / Noise: Buddha Series',
    year: '2025',
    series: '数位拼贴',
    seriesEn: 'Digital Collage',
    media: 'Digital collage, variable dimensions',
    mediaEn: 'Digital collage, variable dimensions',
    dimensions: 'Variable dimensions',
    synopsis: '《Signal / Noise: Buddha Series》是一件由十二个视觉询问（twelve enquiries）构成的作品，这十二幅图像以横向并置的方式呈现，形成连续的视觉带。每一个询问都探讨一个边界的崩塌：佛教神圣图像如何被现代视觉系统吞没——警告符号、CCTV 框架、工业安全图示、机械化指令与算法噪声等。当十二个图像被并置，它们不再是独立作品，而成为十二个同步发生的干扰节点。它们共同生成一个系统性的噪声场：神性被重新框定、重新扫描、被标记、被规训、被误读。在这一排列中，观者面对的是对神圣的十二次"覆盖尝试"。',
    synopsisEn: 'Signal / Noise: Buddha Series is a single work composed of twelve parallel enquiries, arranged horizontally as a continuous visual sequence. Each enquiry interrogates the collapsing boundary between sacred Buddhist iconography and contemporary systems of visual authority—warning symbols, CCTV framing devices, industrial safety graphics, typographic commands, and algorithmic noise. Placed side-by-side, the twelve images behave not as individual artworks but as twelve synchronized disruptions. Their simultaneity produces a field of systemic interference: divinity is reframed, re-scanned, flagged, regulated, and misread. In this alignment, the viewer is confronted with a spectrum of distortions—twelve attempts to overwrite the sacred.',
    imageUrl: '/images/signal-noise-buddha-series/spiral-original-compressed.jpg',
    category: 'selected-works'
  },
  {
    id: '8-1',
    title: 'Spiral Buddha',
    titleEn: 'Spiral Buddha',
    year: '2025',
    series: '数位拼贴',
    seriesEn: 'Digital Collage',
    media: 'Digital collage, variable dimensions',
    mediaEn: 'Digital collage, variable dimensions',
    dimensions: 'Variable dimensions',
    synopsis: '旋转靶标覆盖佛像，将冥想转化为"追踪—锁定—系统获取"的过程。漩涡既是遮挡，也是无限误读的隐喻：神性被困于重复的信号回路中。',
    synopsisEn: 'A spiraling target overlays the Buddha\'s face, turning contemplation into an act of tracking, locking, and system acquisition. The swirl functions simultaneously as a visual obstruction and a metaphor for recursive misinterpretation—divinity caught in an endless loop of signals.',
    imageUrl: '/images/signal-noise-buddha-series/spiral-original-compressed.jpg',
    category: 'selected-works'
  },
  {
    id: '8-2',
    title: 'STOP Buddha',
    titleEn: 'STOP Buddha',
    year: '2025',
    series: '数位拼贴',
    seriesEn: 'Digital Collage',
    media: 'Digital collage, variable dimensions',
    mediaEn: 'Digital collage, variable dimensions',
    dimensions: 'Variable dimensions',
    synopsis: '"STOP" 的指令切断佛像，以基础设施的权力强行中止神性。佛像成为被系统指令支配的界面，而非能动的精神媒介。',
    synopsisEn: 'A universal command—STOP—interrupts the figure. The sacred is halted by infrastructural authority, frozen in a state of operational suspension. The Buddha becomes a regulated surface, subject to system instructions rather than spiritual agency.',
    imageUrl: '/images/signal-noise-buddha-series/stop-original-compressed.jpg',
    category: 'selected-works'
  },
  {
    id: '8-3',
    title: 'Human Buddha',
    titleEn: 'Human Buddha',
    year: '2025',
    series: '数位拼贴',
    seriesEn: 'Digital Collage',
    media: 'Digital collage, variable dimensions',
    mediaEn: 'Digital collage, variable dimensions',
    dimensions: 'Variable dimensions',
    synopsis: '在层叠与噪点中呈现的人类轮廓模糊了遗迹、影像与被监控主体之间的界线。神性变得不稳定——介于记忆与系统生成之间。',
    synopsisEn: 'Human-like features emerge through glitch and layering, blurring the categories of relic, image, and monitored subject. Divinity is rendered unstable—half remembered, half reconstructed by artificial visual logic.',
    imageUrl: '/images/signal-noise-buddha-series/human-original-compressed.jpg',
    category: 'selected-works'
  },
  {
    id: '8-4',
    title: 'Multi-faced Buddha',
    titleEn: 'Multi-faced Buddha',
    year: '2025',
    series: '数位拼贴',
    seriesEn: 'Digital Collage',
    media: 'Digital collage, variable dimensions',
    mediaEn: 'Digital collage, variable dimensions',
    dimensions: 'Variable dimensions',
    synopsis: '多面佛在现代框架系统的切割下被压缩成可读的分段，宛如扫描程序的数据栅格。原本的多元启示被拆解为破碎的界面。',
    synopsisEn: 'A many-faced deity collapses under modern framing systems. Vertical bars segment the divine into readable units, echoing scanning protocols and data capture grids. The multiplicity of enlightenment becomes a fragmented interface.',
    imageUrl: '/images/signal-noise-buddha-series/multi-faced-original-compressed.jpg',
    category: 'selected-works'
  },
  {
    id: '8-5',
    title: 'Praying Buddha',
    titleEn: 'Praying Buddha',
    year: '2025',
    series: '数位拼贴',
    seriesEn: 'Digital Collage',
    media: 'Digital collage, variable dimensions',
    mediaEn: 'Digital collage, variable dimensions',
    dimensions: 'Variable dimensions',
    synopsis: '祈祷的姿态被粗体文字遮断，语言侵入仪式，将精神行为转化为噪声的堆积场。神圣手势沦为干扰的视觉载体。',
    synopsisEn: 'The gesture of prayer is obstructed by bold typographic overlays. Words intrude upon ritual, converting a spiritual act into a site of noise accumulation. The sacred gesture becomes a visual field of interference.',
    imageUrl: '/images/signal-noise-buddha-series/praying-original-compressed.jpg',
    category: 'selected-works'
  },
  {
    id: '8-6',
    title: 'Elephant Buddha',
    titleEn: 'Elephant Buddha',
    year: '2025',
    series: '数位拼贴',
    seriesEn: 'Digital Collage',
    media: 'Digital collage, variable dimensions',
    mediaEn: 'Digital collage, variable dimensions',
    dimensions: 'Variable dimensions',
    synopsis: '动物与佛像的轮廓在数字侵蚀下混合，象征性的等级差异被系统抹平，一切图像被降格为可处理的数据。',
    synopsisEn: 'Animal form and Buddha form merge under digital erosion. The hybridized silhouette suggests a loss of categorical distinction—the system flattens symbolic hierarchies, treating all imagery as equal data to be processed.',
    imageUrl: '/images/signal-noise-buddha-series/elephant-original-compressed.jpg',
    category: 'selected-works'
  },
  {
    id: '8-7',
    title: 'Warning Buddha',
    titleEn: 'Warning Buddha',
    year: '2025',
    series: '数位拼贴',
    seriesEn: 'Digital Collage',
    media: 'Digital collage, variable dimensions',
    mediaEn: 'Digital collage, variable dimensions',
    dimensions: 'Variable dimensions',
    synopsis: '警告标语覆盖佛像，使启示之地变为危险区。危险的审美取代宁静，质疑现代系统如何重新诠释神圣。',
    synopsisEn: 'Warning banners overwrite the figure, transforming enlightenment into a hazard zone. The aesthetic of danger replaces the aesthetic of tranquility, questioning how modern infrastructures reinterpret sacred meaning.',
    imageUrl: '/images/signal-noise-buddha-series/warning-original-compressed.jpg',
    category: 'selected-works'
  },
  {
    id: '8-8',
    title: 'Eye-wash Buddha',
    titleEn: 'Eye-wash Buddha',
    year: '2025',
    series: '数位拼贴',
    seriesEn: 'Digital Collage',
    media: 'Digital collage, variable dimensions',
    mediaEn: 'Digital collage, variable dimensions',
    dimensions: 'Variable dimensions',
    synopsis: '紧急洗眼站的图示与佛像叠加，工业安全设计与宗教图像发生冲突。佛像被迫纳入制度化的操作手册之中。',
    synopsisEn: 'Emergency eyewash graphics intersect with the deity, creating a collision between industrial safety design and spiritual iconography. The Buddha becomes part of an institutional instruction manual.',
    imageUrl: '/images/signal-noise-buddha-series/eye-wash-original-compressed.jpg',
    category: 'selected-works'
  },
  {
    id: '8-9',
    title: 'Warning Buddha 2',
    titleEn: 'Warning Buddha 2',
    year: '2025',
    series: '数位拼贴',
    seriesEn: 'Digital Collage',
    media: 'Digital collage, variable dimensions',
    mediaEn: 'Digital collage, variable dimensions',
    dimensions: 'Variable dimensions',
    synopsis: '警告语言的再次叠加强化了系统性的侵入，仿佛佛像触发了自动化的警示程序。',
    synopsisEn: 'A second iteration of the warning aesthetic intensifies the system\'s intrusion. The repetition simulates algorithmic flagging, as though the deity triggers an automated alert protocol.',
    imageUrl: '/images/signal-noise-buddha-series/warning-buddha-2-original-compressed.jpg',
    category: 'selected-works'
  },
  {
    id: '8-10',
    title: 'CCTV Buddha',
    titleEn: 'CCTV Buddha',
    year: '2025',
    series: '数位拼贴',
    seriesEn: 'Digital Collage',
    media: 'Digital collage, variable dimensions',
    mediaEn: 'Digital collage, variable dimensions',
    dimensions: 'Variable dimensions',
    synopsis: 'CCTV 标记将佛像框定为被监视的对象。监控逻辑取代供奉逻辑，让观者意识到神圣遗迹被当作安防事件处理。',
    synopsisEn: 'CCTV markers frame the Buddha as a monitored subject. Surveillance logic replaces devotional logic; the viewer is invited to witness a sacred relic treated as a security event.',
    imageUrl: '/images/signal-noise-buddha-series/cctv-original-compressed.jpg',
    category: 'selected-works'
  },
  {
    id: '8-11',
    title: 'Forbidden Crossing Buddha',
    titleEn: 'Forbidden Crossing Buddha',
    year: '2025',
    series: '数位拼贴',
    seriesEn: 'Digital Collage',
    media: 'Digital collage, variable dimensions',
    mediaEn: 'Digital collage, variable dimensions',
    dimensions: 'Variable dimensions',
    synopsis: '"横断禁止"的交通符号覆盖在佛像头部之上，将公共行为规训与神圣图像强制重叠。半色调纹理让整个画面呈现如同量产控制图式般的质感，使神性被降格为日常的遵从界面。佛像成为市民规训直接覆盖精神性的场域。',
    synopsisEn: 'A "No Crossing" traffic sign is superimposed on the Buddha\'s head, merging public-behavior regulation with sacred iconography. The halftone texture evokes mass-printed control graphics, reducing the divine image to a mundane compliance surface. The Buddha becomes a site where civic restriction overwrites spiritual presence.',
    imageUrl: '/images/signal-noise-buddha-series/forbidden-crossing-original-compressed.jpg',
    category: 'selected-works'
  },
  {
    id: '8-12',
    title: 'No-Smoking Buddha',
    titleEn: 'No-Smoking Buddha',
    year: '2025',
    series: '数位拼贴',
    seriesEn: 'Digital Collage',
    media: 'Digital collage, variable dimensions',
    mediaEn: 'Digital collage, variable dimensions',
    dimensions: 'Variable dimensions',
    synopsis: '禁烟标识切断多面佛像，将原本象征启示多样性的形象压缩为单一行为禁令。宗教图像与制度化标志间的冲突形成视觉悖论：精神性的超越被规训性语言覆盖，使冥想转化为服从。',
    synopsisEn: 'A no-smoking symbol slices through the multi-faced deity, replacing the multiplicity of enlightenment with a single behavioral prohibition. The friction between religious imagery and institutional signage creates a visual paradox: spiritual transcendence is eclipsed by regulatory language, turning contemplation into compliance.',
    imageUrl: '/images/signal-noise-buddha-series/no-smoking-original-compressed.jpg',
    category: 'selected-works'
  },
  // C. Projection / Mixed Media（投影 / 混合媒材）
  {
    id: '9',
    title: '炭烤大猪蹄',
    titleEn: 'Charcoal-Grilled Pork Knuckles',
    year: '2024',
    series: '投影 / 混合媒材',
    seriesEn: 'Projection / Mixed Media',
    media: 'Projection on illustration board',
    mediaEn: 'Projection on illustration board',
    dimensions: '20 × 30 in',
    synopsis: '《炭烤大猪蹄》以文字构成一幅关于内在的肖像。作品源自 Kim 的幸福片段，并透过 AI 的迭代生成扩展成更完整的意象。我将这些语句翻译为繁体中文，依情绪赋予色彩，再排布成一整面流动的文字景观，并投影在冷压画板上，使数字诗意拥有实体般的存在感。此作品并非描绘外貌，而是尝试以记忆、语言与情绪的纹理，描绘一个人真正的样貌。',
    synopsisEn: 'Charcoal-Grilled Pork Knuckles is a typographic portrait constructed from the intimate imagery that defines a person\'s inner world. By gathering a list of moments that bring Kim genuine happiness—and expanding them through an AI-assisted iterative process—I translated each phrase into Traditional Chinese and assigned it a color guided by emotional tone. These words were composed into a dense moving field of text and projected onto a cold-press illustration board, giving the digital poem a physical, portrait-like presence. Rather than depicting appearance, the work captures a human being through memory, language, and the textures of feeling.',
    imageUrl: '/images/charcoal-Grilled Pork Knuckles/pork-knuckles-1.jpg',
    category: 'selected-works'
  },
  // Oracle Mirror
  {
    id: 'oracle-mirror',
    title: 'Oracle Mirror',
    titleEn: 'Oracle Mirror',
    year: '2025',
    series: '互动装置',
    seriesEn: 'Interactive Installation',
    media: 'Interactive mirror installation with TOF sensor, Arduino, Processing',
    mediaEn: 'Interactive mirror installation with TOF sensor, Arduino, Processing',
    dimensions: 'Variable dimensions',
    synopsis: '《Oracle Mirror》是一个后 ATLAS 时代的推测性装置。作品以 TLV 镜为媒介，整合 20 位真实公众人物的视频片段，通过距离传感器监测观众行为。镜面本应反映现实，却反映了权力；信息成为噪声，引导被感知控制所取代。作品探讨现代神话、真理的不稳定性、信息暴力与系统性控制。',
    synopsisEn: 'Oracle Mirror is a post-ATLAS speculative device. The work uses a TLV mirror as medium, integrating video clips from 20 real public figures, monitoring viewer behavior through distance sensors. The mirror should reflect reality but reflects power instead; information becomes noise, guidance replaced by perception control. The work explores modern myth, truth instability, information violence, and systemic control.',
    imageUrl: '/images/oracle-mirror/oracle-mirror-1.jpg',
    category: 'selected-works'
  }
];

// --- COMPONENTS ---

// Helper function to get all images for a work based on its imageUrl
const getWorkImages = (work: Work): string[] => {
  // Extract the base path from the imageUrl
  const baseUrl = work.imageUrl;

  // Map work IDs to their image folder and naming patterns
  const imageMaps: Record<string, { folder: string; pattern: string; count: number; extension: string; suffix?: string }> = {
    '1': { folder: 'truisms-prove', pattern: 'truisms-prove', count: 5, extension: 'jpg', suffix: '-compressed' },
    '2': { folder: 'have-i-truly-become-monster', pattern: 'have-i-truly-become-monster', count: 6, extension: 'jpg', suffix: '-compressed' },
    '3': { folder: 'sister-tonight-i-dont-care', pattern: 'sister', count: 3, extension: 'jpg' }, // Only jpg files, excluding mp4, no suffix
    '4': { folder: 'media{loop}', pattern: 'media-loop', count: 4, extension: 'jpg', suffix: '-compressed' },
    '5': { folder: 'void-radiance', pattern: 'void-radiance', count: 7, extension: 'jpg', suffix: '-compressed' },
    '6': { folder: 'human-flawed-machine', pattern: 'human-flawed-machine', count: 8, extension: 'jpg', suffix: '-compressed' },
    '8': { folder: 'signal-noise-buddha-series', pattern: '', count: 12, extension: 'jpg', suffix: '-original-compressed' },
    '8-1': { folder: 'signal-noise-buddha-series', pattern: 'spiral', count: 1, extension: 'jpg', suffix: '-original-compressed' },
    '8-2': { folder: 'signal-noise-buddha-series', pattern: 'stop', count: 1, extension: 'jpg', suffix: '-original-compressed' },
    '8-3': { folder: 'signal-noise-buddha-series', pattern: 'human', count: 1, extension: 'jpg', suffix: '-original-compressed' },
    '8-4': { folder: 'signal-noise-buddha-series', pattern: 'multi-faced', count: 1, extension: 'jpg', suffix: '-original-compressed' },
    '8-5': { folder: 'signal-noise-buddha-series', pattern: 'praying', count: 1, extension: 'jpg', suffix: '-original-compressed' },
    '8-6': { folder: 'signal-noise-buddha-series', pattern: 'elephant', count: 1, extension: 'jpg', suffix: '-original-compressed' },
    '8-7': { folder: 'signal-noise-buddha-series', pattern: 'warning', count: 1, extension: 'jpg', suffix: '-original-compressed' },
    '8-8': { folder: 'signal-noise-buddha-series', pattern: 'eye-wash', count: 1, extension: 'jpg', suffix: '-original-compressed' },
    '8-9': { folder: 'signal-noise-buddha-series', pattern: 'warning-buddha-2', count: 1, extension: 'jpg', suffix: '-original-compressed' },
    '8-10': { folder: 'signal-noise-buddha-series', pattern: 'cctv', count: 1, extension: 'jpg', suffix: '-original-compressed' },
    '8-11': { folder: 'signal-noise-buddha-series', pattern: 'forbidden-crossing', count: 1, extension: 'jpg', suffix: '-original-compressed' },
    '8-12': { folder: 'signal-noise-buddha-series', pattern: 'no-smoking', count: 1, extension: 'jpg', suffix: '-original-compressed' },
    '9': { folder: 'charcoal-Grilled Pork Knuckles', pattern: 'pork-knuckles', count: 4, extension: 'jpg' },
  };

  const imageConfig = imageMaps[work.id];

  if (!imageConfig) {
    // If no config found, return just the main image
    return [baseUrl];
  }

  const images: string[] = [];

  if (imageConfig.pattern === '') {
    // Special case for Buddha series main work - return all 12 images
    const buddhaImages = ['spiral', 'stop', 'human', 'multi-faced', 'praying', 'elephant', 'warning', 'eye-wash', 'warning-buddha-2', 'cctv', 'forbidden-crossing', 'no-smoking'];
    const suffix = imageConfig.suffix || '';
    buddhaImages.forEach(img => {
      images.push(`/images/${imageConfig.folder}/${img}${suffix}.${imageConfig.extension}`);
    });
  } else if (imageConfig.count === 1) {
    // Single image
    const suffix = imageConfig.suffix || '';
    images.push(`/images/${imageConfig.folder}/${imageConfig.pattern}${suffix}.${imageConfig.extension}`);
  } else {
    // Multiple images
    // Special handling for human-flawed-machine which has different naming
    if (work.id === '6') {
      // human-flawed-machine has: main-compressed.jpg, 1-4-compressed.jpg, flaw-1/2/3-compressed.jpg
      const suffix = imageConfig.suffix || '';
      images.push(`/images/${imageConfig.folder}/human-flawed-machine-main${suffix}.${imageConfig.extension}`);
      for (let i = 1; i <= 4; i++) {
        images.push(`/images/${imageConfig.folder}/human-flawed-machine-${i}${suffix}.${imageConfig.extension}`);
      }
      for (let i = 1; i <= 3; i++) {
        images.push(`/images/${imageConfig.folder}/human-flawed-machine-flaw-${i}${suffix}.${imageConfig.extension}`);
      }
    } else if (work.id === '9') {
      // Charcoal-Grilled Pork Knuckles: 1-4, plus closeup
      const suffix = imageConfig.suffix || '';
      for (let i = 1; i <= imageConfig.count; i++) {
        images.push(`/images/${imageConfig.folder}/${imageConfig.pattern}-${i}${suffix}.${imageConfig.extension}`);
      }
      images.push(`/images/${imageConfig.folder}/${imageConfig.pattern}-closeup${suffix}.${imageConfig.extension}`);
    } else {
      // Standard pattern: pattern-1, pattern-2, etc.
      const suffix = imageConfig.suffix || '';
      for (let i = 1; i <= imageConfig.count; i++) {
        images.push(`/images/${imageConfig.folder}/${imageConfig.pattern}-${i}${suffix}.${imageConfig.extension}`);
      }
    }
  }

  // If no images found, return the base URL
  return images.length > 0 ? images : [baseUrl];
};

// ScrollToTop component to handle scroll reset on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch (e) {
      console.error("Scroll error:", e);
    }
  }, [pathname]);

  return null;
}



// About Page Component
const About = ({ language }: { language: Language }) => {
  const aboutContent = {
    zh: {
      title: '关于',
      bio: 'IX 是一位专注于新媒体艺术与互动装置的艺术家，作品探讨技术、身份与当代社会中的真相与叙事。',
      practice: '创作实践',
      practiceText: '通过LED装置、互动媒体、数字影像等多种媒介，IX 的作品质疑技术见证的可靠性，揭示信息在数字系统中的崩解与重构。作品常以"视差"、"故障"、"多重证词"等概念为核心，呈现当代人类在技术结构中的位置与情感状态。',
      exhibitions: '展览',
      exhibitionsText: '作品曾在多个艺术空间与展览中展出。',
      contact: '联系',
      contactText: '如需了解更多信息或合作，请通过以下方式联系。',
      email: '邮箱',
      website: '网站'
    },
    en: {
      title: 'About',
      bio: 'IX is an artist working with new media and interactive installations, exploring technology, identity, and truth in contemporary society.',
      practice: 'Practice',
      practiceText: 'Through LED installations, interactive media, digital moving images, and other mediums, IX\'s work questions the reliability of technical witnesses and reveals how information breaks down and reconstructs within digital systems. Works often center on concepts of "parallax," "glitch," and "multiple testimonies," presenting the position and emotional states of contemporary humans within technological structures.',
      exhibitions: 'Exhibitions',
      exhibitionsText: 'Works have been exhibited in various art spaces and exhibitions.',
      contact: 'Contact',
      contactText: 'For more information or collaboration inquiries, please contact via the following.',
      email: 'Email',
      website: 'Website'
    }
  };

  const content = aboutContent[language];

  return (
    <article className="min-h-screen bg-white dark:bg-gray-900 animate-in fade-in duration-500">
      <div className="w-full px-4 md:px-8 lg:px-12 py-8 md:py-12 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 md:mb-12 text-black dark:text-white leading-tight tracking-tight">
          {content.title}
        </h1>

        <section className="mb-8 md:mb-12">
          <p className="text-base md:text-lg text-black dark:text-gray-300 leading-relaxed mb-6">
            {content.bio}
          </p>
        </section>

        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-black dark:text-white uppercase tracking-tight">
            {content.practice}
          </h2>
          <p className="text-sm md:text-base text-black dark:text-gray-300 leading-relaxed">
            {content.practiceText}
          </p>
        </section>

        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-black dark:text-white uppercase tracking-tight">
            {content.exhibitions}
          </h2>
          <p className="text-sm md:text-base text-black dark:text-gray-300 leading-relaxed">
            {content.exhibitionsText}
          </p>
        </section>

        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-black dark:text-white uppercase tracking-tight">
            {content.contact}
          </h2>
          <p className="text-sm md:text-base text-black dark:text-gray-300 leading-relaxed mb-4">
            {content.contactText}
          </p>
          <div className="text-sm md:text-base text-black dark:text-gray-300">
            <p className="mb-2">
              <span className="font-medium">{content.email}:</span> <a href="mailto:contact@example.com" className="hover:underline">contact@example.com</a>
            </p>
            <p className="mb-4">
              <span className="font-medium">{content.website}:</span> <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="hover:underline">example.com</a>
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://instagram.com/example"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-black dark:text-gray-300 hover:opacity-70 transition-opacity"
                aria-label="Instagram"
              >
                <Instagram size={20} />
                <span className="text-sm">Instagram</span>
              </a>
              <a
                href="https://twitter.com/example"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-black dark:text-gray-300 hover:opacity-70 transition-opacity"
                aria-label="Twitter"
              >
                <Twitter size={20} />
                <span className="text-sm">Twitter</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
};

const Header = ({
  viewMode,
  setViewMode,
  sortMode,
  setSortMode,
  category,
  language,
  setLanguage,
  selectedSeries,
  setSelectedSeries,
  selectedYear,
  setSelectedYear,
  isDarkMode,
  setIsDarkMode
}: any) => {
  const location = useLocation();
  const isWorkDetail = location.pathname.startsWith('/work/');

  const isAbout = location.pathname === '/about';
  const t = translations[language];
  const [showFilters, setShowFilters] = useState(false);


  // Get available series and years for filters
  const availableSeries = useMemo(() => {
    const seriesSet = new Set<string>();
    WORKS.filter(w => w.category === category).forEach(work => {
      const series = language === 'en' && work.seriesEn ? work.seriesEn : work.series;
      seriesSet.add(series);
    });
    return Array.from(seriesSet).sort();
  }, [category, language]);

  const availableYears = useMemo(() => {
    const yearSet = new Set<string>();
    WORKS.filter(w => w.category === category).forEach(work => {
      yearSet.add(work.year);
    });
    return Array.from(yearSet).sort((a, b) => parseInt(b) - parseInt(a));
  }, [category]);

  return (
    <>
      <header className={`sticky top-0 z-50 w-full backdrop-blur-sm px-4 py-4 flex items-center justify-between border-b transition-colors ${isDarkMode
        ? 'bg-gray-900/95 border-gray-700 hover:border-gray-600'
        : 'bg-white/95 border-transparent hover:border-gray-100'
        }`}>
        <div className="flex items-center gap-6">
          <Link to="/" className={`text-2xl font-black tracking-tighter uppercase hover:opacity-70 transition-opacity ${isDarkMode ? 'text-white' : 'text-black'
            }`}>
            IX
          </Link>

          {!isWorkDetail && !isAbout && (
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link
                to="/selected-works"
                className={`uppercase tracking-wider hover:opacity-70 transition-opacity ${category === 'selected-works'
                  ? (isDarkMode ? 'text-white' : 'text-black')
                  : (isDarkMode ? 'text-gray-400' : 'text-gray-400')
                  }`}
              >
                {t.selectedWorks}
              </Link>
              <span className={isDarkMode ? 'text-gray-600' : 'text-gray-300'}>/</span>
              <Link
                to="/experiments"
                className={`uppercase tracking-wider hover:opacity-70 transition-opacity ${category === 'experiments'
                  ? (isDarkMode ? 'text-white' : 'text-black')
                  : (isDarkMode ? 'text-gray-400' : 'text-gray-400')
                  }`}
              >
                {t.experiments}
              </Link>
              <span className={isDarkMode ? 'text-gray-600' : 'text-gray-300'}>/</span>

              <Link
                to="/about"
                className={`uppercase tracking-wider hover:opacity-70 transition-opacity ${location.pathname === '/about'
                  ? (isDarkMode ? 'text-white' : 'text-black')
                  : (isDarkMode ? 'text-gray-400' : 'text-gray-400')
                  }`}
              >
                {language === 'en' ? 'About' : '关于'}
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 transition-colors ${isDarkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-600 hover:text-black'
              }`}
            title={isDarkMode ? t.lightMode : t.darkMode}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
            className={`text-xs font-bold uppercase tracking-widest px-3 py-1 border transition-colors ${isDarkMode
              ? 'border-gray-600 hover:bg-gray-700 hover:text-white text-gray-300'
              : 'border-black hover:bg-black hover:text-white'
              }`}
          >
            {language === 'zh' ? 'EN' : '中'}
          </button>

          {!isWorkDetail && !isAbout && (
            <>
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 transition-colors ${(selectedSeries || selectedYear)
                  ? (isDarkMode ? 'text-white' : 'text-black')
                  : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-black')
                  }`}
                title={t.filter}
              >
                <Filter size={20} />
              </button>

              {/* Sort Toggle (Only visible in Text Mode) */}
              {viewMode === 'text' && (
                <button
                  onClick={() => setSortMode(sortMode === 'series' ? 'year' : 'series')}
                  className={`hidden md:block text-[10px] font-bold uppercase tracking-widest px-3 py-1 border transition-colors ${isDarkMode
                    ? 'border-gray-600 hover:bg-gray-700 hover:text-white text-gray-300'
                    : 'border-black hover:bg-black hover:text-white'
                    }`}
                >
                  {t.sortBy}: {sortMode === 'series' ? t.series : t.year}
                </button>
              )}

              {/* View Toggles */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode('text')}
                  className={`p-2 transition-colors ${viewMode === 'text'
                    ? (isDarkMode ? 'text-white' : 'text-black')
                    : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-300 hover:text-black')
                    }`}
                  title="Text View"
                >
                  <AlignLeft size={20} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid'
                    ? (isDarkMode ? 'text-white' : 'text-black')
                    : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-300 hover:text-black')
                    }`}
                  title="Grid View"
                >
                  <LayoutGrid size={20} />
                </button>
              </div>

              <Search className={`w-5 h-5 cursor-pointer hover:opacity-60 ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
            </>
          )}
        </div>
      </header>

      {/* Filter Dropdown */}
      {showFilters && !isWorkDetail && !isAbout && (
        <div className={`sticky top-[73px] z-40 w-full px-4 py-4 border-b transition-colors ${isDarkMode
          ? 'bg-gray-900/95 border-gray-700'
          : 'bg-white/95 border-gray-200'
          }`}>
          <div className="flex flex-wrap gap-4 items-center">
            {/* Series Filter */}
            <div className="flex items-center gap-2">
              <label className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                {t.series}:
              </label>
              <select
                value={selectedSeries || ''}
                onChange={(e) => setSelectedSeries(e.target.value || null)}
                className={`text-sm px-3 py-1 border transition-colors ${isDarkMode
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-black'
                  }`}
              >
                <option value="">{t.allSeries}</option>
                {availableSeries.map(series => (
                  <option key={series} value={series}>{series}</option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="flex items-center gap-2">
              <label className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                {t.year}:
              </label>
              <select
                value={selectedYear || ''}
                onChange={(e) => setSelectedYear(e.target.value || null)}
                className={`text-sm px-3 py-1 border transition-colors ${isDarkMode
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-black'
                  }`}
              >
                <option value="">{t.allYears}</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {(selectedSeries || selectedYear) && (
              <button
                onClick={() => {
                  setSelectedSeries(null);
                  setSelectedYear(null);
                }}
                className={`text-xs font-medium uppercase tracking-wider px-3 py-1 border transition-colors ${isDarkMode
                  ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
                  : 'border-gray-300 hover:bg-gray-100 text-gray-600'
                  }`}
              >
                {language === 'en' ? 'Clear' : '清除'}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const TextCloudView = ({ sortMode, category, language, selectedSeries, selectedYear }: {
  sortMode: 'series' | 'year',
  category: 'experiments' | 'selected-works',
  language: Language,
  selectedSeries: string | null,
  selectedYear: string | null
}) => {
  const content = useMemo(() => {
    // Filter works by category
    let filteredWorks = WORKS.filter(work => work.category === category);

    // Apply series filter
    if (selectedSeries) {
      filteredWorks = filteredWorks.filter(work => {
        const workSeries = language === 'en' && work.seriesEn ? work.seriesEn : work.series;
        return workSeries === selectedSeries;
      });
    }

    // Apply year filter
    if (selectedYear) {
      filteredWorks = filteredWorks.filter(work => work.year === selectedYear);
    }

    // Helper function to get localized text
    const getTitle = (work: Work) => language === 'en' && work.titleEn ? work.titleEn : work.title;
    const getSeries = (work: Work) => {
      if (language === 'en' && work.seriesEn) return work.seriesEn;
      return work.series;
    };

    if (sortMode === 'year') {
      // Sort by year descending
      const sorted = [...filteredWorks].sort((a, b) => parseInt(b.year) - parseInt(a.year));
      return (
        // CHANGED: Removed 'text-justify' to fix large gaps on resize. Using 'text-left' with tight leading.
        <div className="leading-[2.2] text-lg md:text-xl text-left">
          {sorted.map((work, i) => (
            <span key={work.id}>
              <Link
                to={`/work/${work.id}`}
                className="font-bold text-gray-900 hover:text-red-600 hover:underline transition-colors cursor-pointer"
              >
                {getTitle(work)} <span className="text-gray-400 font-normal text-sm align-top">{work.year}</span>
              </Link>
              {i < sorted.length - 1 && <span className="text-gray-300 mx-3">/</span>}
            </span>
          ))}
        </div>
      );
    } else {
      // Group by Series
      const grouped: Record<string, Work[]> = {};
      filteredWorks.forEach(work => {
        const seriesKey = getSeries(work);
        if (!grouped[seriesKey]) grouped[seriesKey] = [];
        grouped[seriesKey].push(work);
      });

      // Determine display order based on SERIES_COLORS definition + any others found
      const orderedSeries = [
        ...Object.keys(SERIES_COLORS),
        ...Object.keys(grouped).filter(k => !SERIES_COLORS[k])
      ].filter(k => grouped[k] && grouped[k].length > 0);

      return (
        // CHANGED: Removed 'text-justify' to fix blue box issue. Used 'text-left' for natural word spacing.
        <div className="leading-[2.2] text-lg md:text-xl text-left">
          {orderedSeries.map((seriesName, seriesIndex) => {
            const seriesWorks = grouped[seriesName];
            const seriesColor = SERIES_COLORS[seriesName] || '#000000';

            return (
              <span key={seriesName} className="inline">
                {/* Series Title - Non-clickable, Colored */}
                <span
                  style={{ color: seriesColor }}
                  className="font-black uppercase tracking-tight mr-1"
                >
                  {seriesName}:
                </span>

                {/* Works in Series */}
                {seriesWorks.map((work, workIndex) => (
                  <span key={work.id}>
                    <Link
                      to={`/work/${work.id}`}
                      className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:underline transition-colors font-medium decoration-1 underline-offset-2"
                    >
                      {getTitle(work)}
                    </Link>
                    {/* Comma between works, or space if end of series */}
                    {workIndex < seriesWorks.length - 1 ? (
                      <span className="text-gray-300 mr-2">,</span>
                    ) : null}
                  </span>
                ))}

                {/* Separator between series. */}
                <span className="mr-3 inline-block"> </span>
              </span>
            );
          })}
        </div>
      );
    }
  }, [sortMode, category, language, selectedSeries, selectedYear]);

  return (
    <div className="w-full min-h-screen bg-white p-4 md:p-8 lg:p-12 animate-in fade-in duration-500">
      {content}
    </div>
  );
};

// Updated ImageGridView for Variable Widths / Fixed Heights
const ImageGridView = ({ category, language, selectedSeries, selectedYear }: {
  category: 'experiments' | 'selected-works',
  language: Language,
  selectedSeries: string | null,
  selectedYear: string | null
}) => {
  // Filter works by category
  let filteredWorks = WORKS.filter(work => work.category === category);

  // Apply series filter
  if (selectedSeries) {
    filteredWorks = filteredWorks.filter(work => {
      const workSeries = language === 'en' && work.seriesEn ? work.seriesEn : work.series;
      return workSeries === selectedSeries;
    });
  }

  // Apply year filter
  if (selectedYear) {
    filteredWorks = filteredWorks.filter(work => work.year === selectedYear);
  }

  // Helper function to get localized title
  const getTitle = (work: Work) => language === 'en' && work.titleEn ? work.titleEn : work.title;

  return (
    <div className="w-full min-h-screen bg-white p-4">
      {/* 
        Flex Layout Logic:
        - flex-wrap: allows items to wrap to next line
        - gap-4: unified spacing between all items
        - h-64 (or variable based on breakpoint): sets the fixed height row
        - img w-auto: allows image to calculate width based on height + aspect ratio
        - grow: makes images expand to fill row if there's leftover space (masonry effect)
      */}
      <div className="flex flex-wrap gap-4">
        {filteredWorks.map((work) => (
          <Link
            to={`/work/${work.id}`}
            key={work.id}
            className="group relative h-48 md:h-64 lg:h-80 grow basis-auto bg-gray-50 overflow-hidden"
          >
            {/* 
               Changed object-cover to w-auto + h-full to preserve aspect ratio.
               If you want them to fill the space perfectly without gaps, 'grow' handles the container,
               but we need to ensure the image covers that container. 
               
               For artist portfolios, usually you want the full image visible:
               Option A: object-contain (shows full image, might leave white bars)
               Option B: object-cover (fills square, might crop)
               Option C (Selected): Flexbox auto-width (No crop, variable width)
            */}
            <img
              src={work.imageUrl}
              alt={getTitle(work)}
              className="h-full min-w-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale contrast-[1.1] group-hover:grayscale-0 group-hover:contrast-100"
              loading="lazy"
              decoding="async"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />

            {/* Title on Hover */}
            <div className="absolute bottom-0 left-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full bg-gradient-to-t from-black/50 to-transparent">
              <p className="text-white font-bold text-xs uppercase tracking-widest truncate">{getTitle(work)}</p>
            </div>
          </Link>
        ))}
        {/* Spacers to prevent last row from over-stretching */}
        <div className="grow-[10] h-48 md:h-64 lg:h-80"></div>
      </div>
    </div>
  );
};

const WorkDetail = ({ language }: { language: Language }) => {
  const { id } = useParams();
  const t = translations[language];

  const currentIndex = WORKS.findIndex(w => w.id === id);
  const work = WORKS[currentIndex];

  if (!work) return <div className="p-8 text-center uppercase tracking-widest">{t.workNotFound}</div>;

  // Get all images for this work
  const allImages = getWorkImages(work);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset image index when work changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setIsFullscreen(false);
  }, [id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'Escape') {
          setIsFullscreen(false);
        } else if (e.key === 'ArrowLeft') {
          goToPreviousImage();
        } else if (e.key === 'ArrowRight') {
          goToNextImage();
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, currentImageIndex, allImages.length]);

  // Helper functions to get localized text
  const getTitle = () => language === 'en' && work.titleEn ? work.titleEn : work.title;
  const getSeries = () => {
    if (language === 'en' && work.seriesEn) return work.seriesEn;
    return work.series;
  };
  const getMedia = () => language === 'en' && work.mediaEn ? work.mediaEn : work.media;
  const getSynopsis = () => language === 'en' && work.synopsisEn ? work.synopsisEn : work.synopsis;

  // Image navigation functions
  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  // Share function
  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}#/work/${work.id}`;
    const shareData = {
      title: getTitle(),
      text: getSynopsis().substring(0, 200) + '...',
      url: url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch (err) {
      // User cancelled or error occurred, try clipboard fallback
      try {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      } catch (clipboardErr) {
        console.error('Failed to copy:', clipboardErr);
      }
    }
  };

  // Find works in the same category for navigation
  const sameCategoryWorks = WORKS.filter(w => w.category === work.category);
  const currentCategoryIndex = sameCategoryWorks.findIndex(w => w.id === work.id);
  const prevWork = sameCategoryWorks[currentCategoryIndex - 1];
  const nextWork = sameCategoryWorks[currentCategoryIndex + 1];

  // Find related works from the same series and same category
  const relatedWorks = WORKS.filter(w => {
    const workSeries = getSeries();
    const wSeries = language === 'en' && w.seriesEn ? w.seriesEn : w.series;
    return wSeries === workSeries && w.category === work.category && w.id !== work.id;
  }).slice(0, 4);

  return (
    <article
      className="min-h-screen bg-white animate-in fade-in duration-500"
      style={{
        textAlign: 'left',
        display: 'block',
        width: '100%',
        margin: 0,
        padding: 0
      }}
    >
      {/* Main Content Container - All left aligned */}
      <div
        className="w-full px-4 md:px-8 lg:px-12 py-8 md:py-12"
        style={{
          textAlign: 'left',
          display: 'block',
          width: '100%',
          maxWidth: 'none',
          margin: 0,
          marginLeft: 0,
          marginRight: 0,
          paddingLeft: '1rem',
          paddingRight: '1rem'
        }}
      >

        {/* Title Section - Left aligned */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4 text-black leading-tight tracking-tight text-left" style={{ textAlign: 'left' }}>
          {getTitle()}
        </h1>

        {/* Year - Left aligned */}
        <section className="mb-8 md:mb-12 text-left" style={{ textAlign: 'left' }}>
          <p className="text-base md:text-lg text-black">{work.year}</p>
        </section>

        {/* Share Button */}
        <div className="mb-4 flex items-center gap-4">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium uppercase tracking-wider border border-black hover:bg-black hover:text-white transition-colors"
            aria-label="Share"
          >
            {shareCopied ? (
              <>
                <Check size={16} />
                {language === 'en' ? 'Copied!' : '已复制!'}
              </>
            ) : (
              <>
                <Share2 size={16} />
                {language === 'en' ? 'Share' : '分享'}
              </>
            )}
          </button>
        </div>

        {/* Video Player Section */}
        {work.videoUrl && (
          <section className="mb-8 md:mb-12">
            <div className="relative w-full" style={{ maxHeight: '90vh' }}>
              <video
                ref={videoRef}
                src={work.videoUrl}
                controls
                className="w-full h-auto"
                style={{ maxHeight: '90vh', objectFit: 'contain' }}
              >
                {language === 'en' ? 'Your browser does not support the video tag.' : '您的浏览器不支持视频标签。'}
              </video>
            </div>
          </section>
        )}

        {/* Image Gallery Section - Enhanced with fullscreen */}
        <section
          className="mb-8 md:mb-12"
          style={{
            marginBottom: '2rem',
            textAlign: 'left',
            display: 'block',
            width: '100%',
            clear: 'both'
          }}
        >
          <div
            className="work-detail-image-container"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              width: '100%',
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {/* Left Arrow */}
            {allImages.length > 1 && (
              <button
                onClick={goToPreviousImage}
                className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white border border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                aria-label="Previous image"
              >
                <ArrowLeft size={20} />
              </button>
            )}

            {/* Image Strip Container */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                overflowX: 'auto',
                scrollBehavior: 'smooth',
                flex: 1,
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
              className="scrollbar-hide"
            >
              {allImages.map((imageUrl, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    flexShrink: 0,
                    display: index === currentImageIndex ? 'block' : 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => setIsFullscreen(true)}
                >
                  <img
                    ref={index === currentImageIndex ? imageRef : null}
                    src={imageUrl}
                    alt={`${getTitle()} - Image ${index + 1}`}
                    className="work-detail-image"
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '90vh',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      verticalAlign: 'top',
                      position: 'relative',
                      display: 'block'
                    }}
                  />
                  <p style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    fontSize: '10px',
                    color: 'rgba(0, 0, 0, 0.6)',
                    margin: 0,
                    padding: 0,
                    pointerEvents: 'none'
                  }}>
                    © IX
                  </p>
                  {/* Fullscreen hint */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    padding: '4px 8px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    pointerEvents: 'none'
                  }}>
                    <Maximize2 size={12} />
                    {language === 'en' ? 'Click to fullscreen' : '点击全屏'}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            {allImages.length > 1 && (
              <button
                onClick={goToNextImage}
                className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white border border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                aria-label="Next image"
              >
                <ArrowRight size={20} />
              </button>
            )}

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div
                className="flex-shrink-0 text-xs text-gray-500"
                style={{ minWidth: '60px', textAlign: 'center' }}
              >
                {currentImageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>

          {/* Thumbnail Strip (Optional - shows all images as thumbnails) */}
          {allImages.length > 1 && (
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                marginTop: '1rem',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
              className="scrollbar-hide"
            >
              {allImages.map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  style={{
                    flexShrink: 0,
                    width: '80px',
                    height: '80px',
                    border: index === currentImageIndex ? '2px solid black' : '1px solid #e5e5e5',
                    padding: '2px',
                    cursor: 'pointer',
                    background: 'white',
                    transition: 'border-color 0.2s'
                  }}
                  className="hover:border-gray-400"
                >
                  <img
                    src={imageUrl}
                    alt={`Thumbnail ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Work Details - Small text, Left aligned */}
        <div className="text-xs md:text-sm text-black mb-6 md:mb-8 leading-relaxed text-left" style={{ textAlign: 'left' }}>
          <div>
            {getMedia()}
            <br />
            {work.dimensions}
          </div>
        </div>

        {/* Synopsis - After work details */}
        {getSynopsis() && (
          <section className="mb-8 md:mb-12 text-left" style={{ textAlign: 'left' }}>
            <p className="text-sm md:text-base text-black leading-relaxed">
              {getSynopsis()}
            </p>
          </section>
        )}

        {/* Related Works - Series links, Left aligned */}
        {relatedWorks.length > 0 && (
          <section className="mb-8 md:mb-12 text-left" style={{ textAlign: 'left' }}>
            {relatedWorks.map((relatedWork) => {
              const getRelatedTitle = () => language === 'en' && relatedWork.titleEn ? relatedWork.titleEn : relatedWork.title;
              return (
                <p key={relatedWork.id} className="mb-1 md:mb-2 text-left" style={{ textAlign: 'left' }}>
                  <Link
                    to={`/work/${relatedWork.id}`}
                    className="text-black hover:text-red-600 transition-colors text-xs md:text-sm"
                  >
                    {getRelatedTitle()}
                  </Link>
                </p>
              );
            })}
          </section>
        )}

        {/* Navigation Arrows - Left aligned */}
        <div className="flex items-center gap-4 text-base md:text-lg text-left justify-start" style={{ justifyContent: 'flex-start' }}>
          {prevWork ? (
            <Link
              to={`/work/${prevWork.id}`}
              className="text-black hover:text-red-600 transition-colors"
            >
              ←
            </Link>
          ) : (
            <span className="text-gray-300">←</span>
          )}
          {nextWork ? (
            <Link
              to={`/work/${nextWork.id}`}
              className="text-black hover:text-red-600 transition-colors"
            >
              →
            </Link>
          ) : (
            <span className="text-gray-300">→</span>
          )}
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
          style={{ cursor: 'pointer' }}
        >
          {/* Close button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close fullscreen"
          >
            <X size={24} />
          </button>

          {/* Fullscreen image */}
          <div
            className="relative max-w-full max-h-full p-4"
            onClick={(e) => e.stopPropagation()}
            style={{ cursor: 'default' }}
          >
            <img
              src={allImages[currentImageIndex]}
              alt={`${getTitle()} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />
            {/* Navigation arrows in fullscreen */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPreviousImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ArrowLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Next image"
                >
                  <ArrowRight size={24} />
                </button>
                {/* Image counter in fullscreen */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 text-white text-sm">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </article>
  );
};

const AppContent = () => {
  const [viewMode, setViewMode] = useState<'text' | 'grid'>('text');
  const [sortMode, setSortMode] = useState<'series' | 'year'>('series');
  const [language, setLanguage] = useState<Language>('en'); // Default to English
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  // Determine category from URL
  const getCategory = (): 'experiments' | 'selected-works' => {
    const path = location.pathname.replace('#', '');
    if (path === '/experiments' || path.includes('experiments')) {
      return 'experiments';
    }
    return 'selected-works'; // default to selected-works
  };

  const category = getCategory();

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen font-sans transition-colors pb-10 ${isDarkMode
      ? 'bg-gray-900 text-white selection:bg-white selection:text-black'
      : 'bg-white text-black selection:bg-black selection:text-white'
      }`}>
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortMode={sortMode}
        setSortMode={setSortMode}
        category={category}
        language={language}
        setLanguage={setLanguage}
        selectedSeries={selectedSeries}
        setSelectedSeries={setSelectedSeries}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <Routes>
        <Route path="/" element={
          viewMode === 'text'
            ? <TextCloudView sortMode={sortMode} category="selected-works" language={language} selectedSeries={selectedSeries} selectedYear={selectedYear} />
            : <ImageGridView category="selected-works" language={language} selectedSeries={selectedSeries} selectedYear={selectedYear} />
        } />
        <Route path="/selected-works" element={
          viewMode === 'text'
            ? <TextCloudView sortMode={sortMode} category="selected-works" language={language} selectedSeries={selectedSeries} selectedYear={selectedYear} />
            : <ImageGridView category="selected-works" language={language} selectedSeries={selectedSeries} selectedYear={selectedYear} />
        } />
        <Route path="/experiments" element={
          viewMode === 'text'
            ? <TextCloudView sortMode={sortMode} category="experiments" language={language} selectedSeries={selectedSeries} selectedYear={selectedYear} />
            : <ImageGridView category="experiments" language={language} selectedSeries={selectedSeries} selectedYear={selectedYear} />
        } />
        <Route path="/work/:id" element={<WorkDetail language={language} />} />

        <Route path="/about" element={<About language={language} />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <AppContent />
    </HashRouter>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}