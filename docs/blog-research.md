# Blog topic research (November 2026)

The 100 articles in `content/blog/` were chosen from real search and voting data, not from guesses.

## Where the data came from

| Source | What it shows | How it was collected |
|---|---|---|
| Google autocomplete | What people type into Google | 60 starting phrases, such as "what is rag" and "git undo" |
| YouTube autocomplete | What people search for as videos | The same 60 phrases |
| Stack Overflow | The most upvoted questions of all time | Top questions for 15 tags (python, javascript, git, sql, docker, and others) |
| Ethereum Stack Exchange | The most upvoted blockchain developer questions | Top 40 questions |
| dev.to | The most liked articles | Top articles for 15 tags |
| Hacker News | The most upvoted stories | 14 topic searches |

Autocomplete shows which phrases are popular. It does not give search volume numbers. Those need a paid tool such as Ahrefs or Semrush, or Google Search Console after the site has traffic.

## What the data showed

- **People search with questions.** "what is ...", "how to ...", "... vs ...", and "... explained" lead in every topic. Each article title uses one of these forms.
- **Beginner questions have the most demand.** "what is rag", "what is blockchain technology in simple words", and "how to learn coding for free" appear far more than advanced topics.
- **Comparisons are searched heavily:** python vs java, docker vs kubernetes, bitcoin vs ethereum, rust vs go, langchain vs langgraph.
- **The top Stack Overflow questions are old and still asked:** undo a Git commit (27,000 votes), git pull vs fetch (14,000), Python yield (13,000), remove an item from a JavaScript array (12,000).
- **On Ethereum Stack Exchange** the top questions are practical Solidity ones: external vs public, what gas is, random numbers, upgradeable contracts, what an ABI is, memory vs calldata.
- **The old articles did not match any of this.** Titles such as "Chat Templates: The Hidden Input Format Behind Model Behavior" answer questions that almost nobody types.

## How each article is built

1. The title is the search phrase.
2. The first paragraph answers the question directly.
3. Sections follow the related searches that autocomplete shows.
4. Code examples and comparison tables are included where they help.
5. An FAQ section answers 3 or 4 related questions. These are also sent to search engines as structured data.
6. Each article links to related articles on the site.

## To do after publishing

- Add the site to Google Search Console and submit `sitemap.xml`.
- After 4 to 8 weeks, check which searches show the articles and improve the ones ranked 5 to 20.
- Check technical details in the articles against current documentation from time to time, mainly tool versions and commands.
