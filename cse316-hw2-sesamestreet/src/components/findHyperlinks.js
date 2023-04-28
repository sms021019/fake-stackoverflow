//hyperlink format: [text](link)
//() cannot be empty and must start with “https://” or “http://”
//if conditions invalidated return [-1]
//if no hyperlinks return [-2]
//else return a list of hyperlink indexes 
//ex: [HL1 start index, HL1 end index, HL2 start index, HL2 end index, ...]
export default function FindHyperlinks(ansText) {
    if (ansText.indexOf('](') >= 0) {
        const hyperlinks = [];
        var prevStrLength = 0;
        var text = ansText;
        while (text.indexOf('](') >= 0) {
            //console.log("text " + text);
            //console.log("strLen: " + prevStrLength);
            const openBracketIndex = text.substring(0, text.indexOf('](')).indexOf('[');
            const closeParIndex = (text.substring(0, text.indexOf('](')).length) + text.substring(text.indexOf('](')).indexOf(')'); //search string after '](' for ')', if found add length of string up to '](' to index

            if (text.indexOf(']()') >= 0) {
                //text contains empty parentheseses after brackets -> [text]()
                if (openBracketIndex >= 0) return [-1];
                //else delete text up to ']()' and search rest of string
                prevStrLength += text.substring(0, text.indexOf(']()')+3).length;
                text = text.substring(text.indexOf(']()')+3);
                
            }

            //
            else if (openBracketIndex >= 0) {
                if (closeParIndex >= text.indexOf('](')) {//hyperlink exists
                    //hyperlink does not start with “https://” or “http://”
                    var linkStartHTTPS = text.substring(text.indexOf('](')+2, text.indexOf('](')+10);
                    var linkStartHTTP = text.substring(text.indexOf('](')+2, text.indexOf('](')+9);
                    if (linkStartHTTP !== 'http://' && linkStartHTTPS !== 'https://') return [-1];

                    //hyperlink is formatted correctly
                    hyperlinks.push(openBracketIndex + prevStrLength);
                    hyperlinks.push(closeParIndex + prevStrLength);
                    //search rest of string
                    text = text.substring(closeParIndex+1);
                    prevStrLength += 1+closeParIndex;
                }
                else text = ""; //no end parentheses, end searching string
            }

            //delete text up to '](' and search rest of string
            else {
                prevStrLength += text.substring(0, text.indexOf('](')+2).length;
                text = text.substring(text.indexOf('](')+2);
            }
        }
        if (hyperlinks.length === 0) return [-2]; 
        return hyperlinks;
    }
    return [-2];
} 