import { getCollection, type CollectionEntry } from 'astro:content';
import { PER_PAGE } from '../consts';

export type Post = CollectionEntry<'blog'>;

/** 公開済みの記事を新しい順で返す。下書き（publish: false）は含まない。 */
export async function getPosts(): Promise<Post[]> {
	const posts = await getCollection('blog', ({ data }) => data.publish);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** タグ名・著者名を URL に載せられる形にする。 */
export function slugify(value: string): string {
	return value.trim().toLowerCase().replace(/\s+/g, '-');
}

/** 総件数からページ数を出す。0 件でも 1 ページ扱いにする。 */
export function pageCount(total: number): number {
	return Math.max(1, Math.ceil(total / PER_PAGE));
}

/** n ページ目（1 始まり）の記事を切り出す。 */
export function pageSlice(posts: Post[], page: number): Post[] {
	return posts.slice((page - 1) * PER_PAGE, page * PER_PAGE);
}

/** 2 ページ目以降のページ番号一覧。1 ページ目は親 URL が持つので含めない。 */
export function extraPages(total: number): number[] {
	return Array.from({ length: pageCount(total) - 1 }, (_, i) => i + 2);
}

type Facet = { name: string; slug: string; posts: Post[] };

function collect(posts: Post[], keys: (post: Post) => string[]): Facet[] {
	const map = new Map<string, Facet>();
	for (const post of posts) {
		for (const name of keys(post)) {
			const slug = slugify(name);
			const facet = map.get(slug) ?? { name, slug, posts: [] };
			facet.posts.push(post);
			map.set(slug, facet);
		}
	}
	// 件数の多い順、同数なら名前順。ナビのタグ並びもこれに従う。
	return [...map.values()].sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name));
}

export async function getTags(): Promise<Facet[]> {
	return collect(await getPosts(), (post) => post.data.tags);
}

export async function getAuthors(): Promise<Facet[]> {
	return collect(await getPosts(), (post) => [post.data.author]);
}
