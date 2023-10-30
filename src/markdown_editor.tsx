export function MarkdownEditor() {
  // this should probably be more than an arrow function
  const markdownToHTML = (markdown: string) => {
    let html = '';
    let cursor = 0;

    const findQueryEnd = (at: number, target: string, query: string) => {
      while (at < target.length && target[at] === query) {
        at++;
      }

      return at;
    };

    const findQueryEndOrCount = (
      at: number,
      target: string,
      query: string,
      count: number
    ) => {
      let seen = 0;
      while (seen < count && at < target.length && target[at] === query) {
        seen += Number(target[at] === query);
        at++;
      }

      return at;
    };

    const findQueryNext = (at: number, target: string, query: string) => {
      while (at < target.length && target[at] !== query) {
        at++;
      }

      return at;
    };

    while (cursor < markdown.length) {
      if (markdown[cursor] === '*') {
        // find end of the closing tags
        // these ranges are all [begin, end)
        const opening = [cursor, findQueryEnd(cursor, markdown, '*')];

        // opening tags can't be followed by whitespace
        if (opening[1] < markdown.length && markdown[opening[1]] !== ' ') {
          cursor = opening[1];
          const text = [cursor, findQueryNext(cursor, markdown, '*')];

          // closing tags can't be preceded by whitespace
          if (text[1] < markdown.length && markdown[text[1]] !== ' ') {
            cursor = text[1];

            const count = opening[1] - opening[0];
            const closing = [
              cursor,
              findQueryEndOrCount(cursor, markdown, '*', count),
            ];

            switch (Math.min(count, closing[1] - closing[0]) % 3) {
              case 0:
                html += `<b><i>${markdown.substring(text[0], text[1])}</b></i>`;
                break;

              case 1:
                html += `<i>${markdown.substring(text[0], text[1])}</i>`;
                break;

              case 2:
                html += `<b>${markdown.substring(text[0], text[1])}</b>`;
                break;
            }
          }
        }
      }

      cursor++;
    }

    console.log(html);
    document.getElementById('test')!.innerHTML = html;
  };

  const markdownCheck = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      const input = window.getSelection()!.anchorNode!.parentNode!.textContent!;
      markdownToHTML(input);
    }
  };

  return (
    <div>
      <div
        id="rendererContent"
        onKeyUp={markdownCheck}
        contentEditable
      >write here</div>
      <div id="test"></div>
    </div>
  );
}
