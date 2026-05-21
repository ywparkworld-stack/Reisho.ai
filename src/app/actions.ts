'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { validateHaiku, type HaikuLines } from '@/lib/mora'

export async function createPost(formData: FormData) {
  const lines: HaikuLines = [
    formData.get('line1') as string,
    formData.get('line2') as string,
    formData.get('line3') as string,
  ]

  if (!validateHaiku(lines)) {
    throw new Error('5・7・5の音節になっていません')
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { error } = await supabase.from('posts').insert({
    user_id: user.id,
    line1: lines[0],
    line2: lines[1],
    line3: lines[2],
  })

  if (error) throw new Error(error.message)

  revalidatePath('/')
  redirect('/')
}

export async function toggleLike(postId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .single()

  if (existing) {
    await supabase.from('likes').delete().eq('id', existing.id)
  } else {
    await supabase.from('likes').insert({ user_id: user.id, post_id: postId })
  }

  revalidatePath('/')
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = (formData.get('username') as string).trim()

  if (!username || username.length < 2) {
    throw new Error('ユーザー名は2文字以上で入力してください')
  }

  const supabase = createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) throw new Error(error.message)

  redirect('/auth/login?message=confirmation-sent')
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
