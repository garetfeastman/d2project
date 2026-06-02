import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { createPost } from '@/app/actions/posts'

const ROLES = ['DPS', 'Healer', 'Status', 'Tank', 'Support']

export default async function NewPostPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl text-gray-900" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, textTransform: 'uppercase' }}>Create Post</h1>
        <p className="text-gray-500 mt-1">Share a build, video, or LFG request</p>
      </div>
      <div className="card p-8">
        <form action={createPost} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">What are you sharing?</label>
            <textarea name="content" required rows={5} placeholder="Describe your build, post your stats, or write an LFG request..." className="field" style={{ resize: 'none' }} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Build Role <span className="text-gray-400 font-normal">(optional)</span></label>
            <div className="flex flex-wrap gap-2">
              <label className="cursor-pointer">
                <input type="radio" name="buildRole" value="" className="sr-only peer" defaultChecked />
                <span className="block text-sm font-semibold px-4 py-2 rounded-full border-2 border-gray-200 text-gray-500 cursor-pointer transition-all peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-600">None</span>
              </label>
              {ROLES.map(role => (
                <label key={role} className="cursor-pointer">
                  <input type="radio" name="buildRole" value={role} className="sr-only peer" />
                  <span className="block text-sm font-semibold px-4 py-2 rounded-full border-2 border-gray-200 text-gray-500 cursor-pointer transition-all peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-600">{role}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
            <input type="checkbox" name="isLFG" id="isLFG" className="w-4 h-4 accent-orange-500" />
            <label htmlFor="isLFG" className="text-sm font-bold text-gray-900 cursor-pointer">This is a <span className="text-orange-500 font-black">Looking for Group</span> post — I&apos;m looking for a teammate</label>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Looking for role <span className="text-gray-600 font-semibold">(if Looking for Group)</span></label>
            <select name="lfgRole" className="field">
              <option value="">Select a role</option>
              {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube Link <span className="text-gray-400 font-normal">(optional)</span></label>
            <input type="url" name="videoUrl" placeholder="https://youtube.com/watch?v=..." className="field" />
          </div>
          <button type="submit" className="btn-primary w-full justify-center py-3" style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>
            Publish Post
          </button>
        </form>
      </div>
    </div>
  )
}
