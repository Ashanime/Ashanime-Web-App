const winWidth = window.innerWidth;

export const imageResize = (image: string) => {
  if (winWidth <= 768) {
    return image.replace("large", "medium");
  }

  return image;
};

export const gridImageResize = (image: string) => {
  if (winWidth <= 768) {
    return image.replace("large", "medium");
  }

  return image;
};
