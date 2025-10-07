import NextImage, { ImageProps } from 'next/image'

const basePath = process.env.BASE_PATH

interface CustomImageProps extends ImageProps {
  caption?: string
}

const Image = ({ src, caption, width, height, alt, ...rest }: CustomImageProps) => (
  <div className="my-3 w-full">
    <div className="relative w-full" style={{ aspectRatio: `${width}/${height}` }}>
      <NextImage
        src={`${basePath || ''}${src}`}
        alt={alt}
        fill
        className="object-contain"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
        {...rest}
      />
    </div>
    {caption && (
      <p className="mt-2 text-center text-sm text-slate-600 italic dark:text-slate-400">
        {caption}
      </p>
    )}
  </div>
)

export default Image
