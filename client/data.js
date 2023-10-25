const baseURL = import.meta.env.PROD ? import.meta.env.VITE_APP_BASE_URL : ''

export const colors = [
  {
    color: 'red',
    code: '#FF4747',
    music: `${baseURL}/music/red.mp3`,
    isPicked: false,
    image: '/images/red.jpg',
  },
  {
    color: 'green',
    code: '#5EE06B',
    music: `${baseURL}/music/green.mp3`,
    isPicked: false,
    image: '/images/green.jpg',
  },
  {
    color: 'blue',
    code: '#4857E0',
    music: `${baseURL}/music/blue.mp3`,
    isPicked: false,
    image: '/images/blue.jpg',
  },
  {
    color: 'black',
    code: '#181818',
    music: `${baseURL}/music/black.mp3`,
    isPicked: false,
    image: '/images/black.jpg',
  },
  {
    color: 'pink',
    code: '#FF6BD3',
    music: `${baseURL}/music/pink.mp3`,
    isPicked: false,
    image: '/images/pink.jpg',
  },
  {
    color: 'yellow',
    code: '#FFFC52',
    music: `${baseURL}/music/yellow.mp3`,
    isPicked: false,
    image: '/images/eraser.jpg',
  },
  {
    color: 'cyan',
    code: '#73F7FF',
    music: `${baseURL}/music/cyan.mp3`,
    isPicked: false,
    image: '/images/eraser.jpg',
  },
]

export const eraser = {
  color: 'eraser',
  code: 'white',
  music: `${baseURL}/music/white.mp3`,
  isPicked: false,
  image: `${baseURL}/images/eraser.svg`,
}

export const clearSound = `${baseURL}/music/clear.mp3`