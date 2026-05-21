import HaikuForm from '@/components/HaikuForm'

export default function PostPage() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-haiku text-ink font-semibold tracking-widest">俳句を詠む</h1>
        <p className="text-muted text-sm mt-2">五・七・五の音節で詠んでください</p>
      </div>
      <HaikuForm />
    </div>
  )
}
