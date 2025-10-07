import NextImage, { ImageProps } from 'next/image'

const basePath = process.env.BASE_PATH

const Image = ({ src, ...rest }: ImageProps) => (
  <div className="my-0.5 flex justify-center">
    <NextImage src={`${basePath || ''}${src}`} {...rest} />
  </div>
)

export default Image
