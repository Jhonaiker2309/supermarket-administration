import React from 'react';
import { Modal, Box } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function NextArrow(props) {
  const { onClick } = props;
  return (
    <div
      style={{
        display: 'block',
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 2,
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <svg fill="#000" height="30px" width="30px" viewBox="0 0 24 24">
        <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6l6,6l-6,6L8.59,16.58z" />
      </svg>
    </div>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      style={{
        display: 'block',
        position: 'absolute',
        left: 10,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 2,
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <svg fill="#000" height="30px" width="30px" viewBox="0 0 24 24">
        <path d="M15.41,16.58L10.83,12l4.58-4.59L14,6l-6,6l6,6L15.41,16.58z" />
      </svg>
    </div>
  );
}

export default function ImageCarousel({ open, onClose, images }) {
  const objectURLs = React.useMemo(() => {
    if (!images) return [];
    return images.map((image) => {
      if (image instanceof File) {
        return URL.createObjectURL(image);
      }
      if (image?.data && image?.mimeType) {
        return `data:${image.mimeType};base64,${image.data}`;
      }
      return image;
    });
  }, [images]);

  // Limpiar los object URLs generados al desmontar o cuando cambien las imágenes
  React.useEffect(() => {
    return () => {
      objectURLs.forEach((url) => {
        if (typeof url === 'string' && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [objectURLs]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
          borderRadius: 2,
          '& .slick-slider': {
            width: '100%',
            height: '100%',
          },
          '& .slick-track, & .slick-list': {
            height: '100%',
          },
          '& .slick-slide > div': {
            height: '100%',
          },
        }}
      >
        <Slider {...sliderSettings}>
          {objectURLs.map((url, index) => (
            <div key={index}>
              <img
                src={url}
                alt={`Imagen ${index + 1}`}
                style={{
                  width: '100%',
                  height: '450px', // Altura fija
                  objectFit: 'contain',
                }}
              />
            </div>
          ))}
        </Slider>
      </Box>
    </Modal>
  );
}