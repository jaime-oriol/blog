import NextImage, { ImageProps } from 'next/image'

const basePath = process.env.BASE_PATH

interface CustomImageProps extends ImageProps {
  noWrapper?: boolean
}

const Image = ({ src, noWrapper = false, ...rest }: CustomImageProps) => {
  const img = <NextImage src={`${basePath || ''}${src}`} {...rest} />

  return noWrapper ? img : <div className="my-0.5 flex justify-center">{img}</div>
}

export default Image
