import { publicAsset } from '../utils/publicAsset';

/**
 * Art files live in `public/artwork/`. URLs respect Vite `base` (GitHub Pages project site).
 */
export const artworks = [
  {
    id: 'LTZ-ART-01',
    title: 'Cipher Guardian',
    category: 'CHARACTER DESIGN',
    year: '2025',
    medium: 'Digital / Photoshop',
    tags: ['character', 'fantasy', 'portrait', 'digital'],
    tools: ['Photoshop', 'Wacom', 'Procreate'],
    description:
      'A mysterious guardian character with intricate design elements and classified appearance. This piece explores the intersection of technology and fantasy aesthetics.',
    image: publicAsset('artwork/1.jpg'),
    imageSecondary: publicAsset('artwork/1-thumb.jpg'),
    commissionStatus: 'OPEN'
  },
  {
    id: 'LTZ-ART-02',
    title: 'Neural Pathways',
    category: 'CONCEPT ART',
    year: '2025',
    medium: 'Digital / Photoshop',
    tags: ['concept', 'abstract', 'tech', 'digital'],
    tools: ['Photoshop', 'Wacom'],
    description:
      'An abstract concept piece exploring digital consciousness and neural networks through visual metaphor. Created for speculative fiction worldbuilding.',
    image: publicAsset('artwork/2.jpg'),
    imageSecondary: publicAsset('artwork/2-thumb.jpg'),
    commissionStatus: 'OPEN'
  },
  {
    id: 'LTZ-ART-03',
    title: 'Crimson Archive',
    category: 'ENVIRONMENT ART',
    year: '2024',
    medium: 'Digital / Photoshop',
    tags: ['environment', 'landscape', 'digital', 'scifi'],
    tools: ['Photoshop', 'Wacom'],
    description:
      'A classified underground facility environment design. Features layered depth and atmospheric lighting to convey classified information storage.',
    image: publicAsset('artwork/3.jpg'),
    imageSecondary: publicAsset('artwork/3-thumb.jpg'),
    commissionStatus: 'OPEN'
  },
  {
    id: 'LTZ-ART-04',
    title: 'Classified Operative',
    category: 'CHARACTER DESIGN',
    year: '2024',
    medium: 'Digital / Photoshop',
    tags: ['character', 'portrait', 'digital', 'spy'],
    tools: ['Photoshop', 'Wacom'],
    description:
      'A clandestine operative character study with emphasis on mysterious demeanor and high-tech accessories.',
    image: publicAsset('artwork/4.jpg'),
    imageSecondary: publicAsset('artwork/4-thumb.jpg'),
    commissionStatus: 'OPEN'
  },
  {
    id: 'LTZ-ART-05',
    title: 'Data Nexus',
    category: 'CONCEPT ART',
    year: '2024',
    medium: 'Digital / Photoshop',
    tags: ['concept', 'tech', 'digital', 'abstract'],
    tools: ['Photoshop', 'Wacom', '3D Base'],
    description:
      'A network visualization concept exploring interconnected data systems and classified information flows through abstract representation.',
    image: publicAsset('artwork/5.jpg'),
    imageSecondary: publicAsset('artwork/5-thumb.jpg'),
    commissionStatus: 'OPEN'
  },
  {
    id: 'LTZ-ART-06',
    title: 'Midnight Protocol',
    category: 'ENVIRONMENT ART',
    year: '2024',
    medium: 'Digital / Photoshop',
    tags: ['environment', 'interior', 'digital', 'scifi'],
    tools: ['Photoshop', 'Wacom'],
    description:
      'An interior environment depicting a classified command center with atmospheric lighting and futuristic interface design.',
    image: publicAsset('artwork/6.jpg'),
    imageSecondary: publicAsset('artwork/6-thumb.jpg'),
    commissionStatus: 'OPEN'
  },
  {
    id: 'LTZ-ART-07',
    title: 'Cipher Protocol',
    category: 'CHARACTER DESIGN',
    year: '2023',
    medium: 'Digital / Photoshop',
    tags: ['character', 'digital', 'scifi', 'portrait'],
    tools: ['Photoshop', 'Wacom'],
    description:
      'A highly classified character with augmented features and mysterious background. Represents the intersection of human and technology.',
    image: publicAsset('artwork/7.jpg'),
    imageSecondary: publicAsset('artwork/7-thumb.jpg'),
    commissionStatus: 'OPEN'
  },
  {
    id: 'LTZ-ART-08',
    title: 'Encrypted Dreams',
    category: 'CONCEPT ART',
    year: '2023',
    medium: 'Digital / Photoshop',
    tags: ['concept', 'surreal', 'digital', 'abstract'],
    tools: ['Photoshop', 'Wacom'],
    description:
      'A surrealist concept exploring encrypted consciousness and digital dreamscapes through layered symbolism and color theory.',
    image: publicAsset('artwork/8.jpg'),
    imageSecondary: publicAsset('artwork/8-thumb.jpg'),
    commissionStatus: 'OPEN'
  }
];
