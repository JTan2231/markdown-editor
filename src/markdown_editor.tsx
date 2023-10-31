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
              findQueryEnd(cursor, markdown, '*'),
            ];

            // get extra asterisks at the beginning and end
            let beginningExtra = 0;
            let endExtra = 0;
            if (count > closing[1] - closing[0]) {
              beginningExtra = count - (closing[1] - closing[0]);
            }
            else if (count < closing[1] - closing[0]) {
              endExtra = (closing[1] - closing[0]) - count;
            }

            switch (Math.min(count, closing[1] - closing[0]) % 3) {
              case 0:
                html += '*'.repeat(beginningExtra) + `<b><i>${markdown.substring(text[0], text[1])}</b></i>` + '*'.repeat(endExtra);
                break;

              case 1:
                html += '*'.repeat(beginningExtra) + `<i>${markdown.substring(text[0], text[1])}</i>` + '*'.repeat(endExtra);
                break;

              case 2:
                html += '*'.repeat(beginningExtra) + `<b>${markdown.substring(text[0], text[1])}</b>` + '*'.repeat(endExtra);
                break;
            }

            cursor = closing[1];
            continue;
          }
          else {
              // no end tag found, revert the cursor and just add the asterisks to the html
              html += markdown.substring(opening[0], opening[1]);
              cursor = opening[1];
              continue;
          }
        }
        else {
          // no end tag found, revert the cursor and just add the asterisks to the html
          html += markdown.substring(opening[0], opening[1]);
          cursor = opening[1];
          continue;
        }
      }
      else {
        html += markdown[cursor];
      }

      cursor++;
    }

    console.log(html);
    document.getElementById('test')!.innerHTML = html;
  };

  const markdownCheck = (e: React.KeyboardEvent<HTMLDivElement>) => {
    //if (e.key === ' ' || e.key === 'Enter') {
      const input = window.getSelection()!.anchorNode!.parentNode!.textContent!;
      markdownToHTML(input);
    //}
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
