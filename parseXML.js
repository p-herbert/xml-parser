export function tokenize(xmlString) {
    const chars = xmlString.split('');
    const tokens = [];

    // Track when a tag was found and adding characters to it
    let tagIsOpen = false;
    let tag = '';

    // Characters found between tags
    let content = '';

    chars.forEach(char => {
        // Tag opened
        if (char === '<') {
            tag = '<';

            // Push content when a new tag is found
            if (content !== '') {
                tokens.push(content);
                content = '';
            }

            tagIsOpen = true;

            // Tag closed
        } else if (char === '>') {
            // Push complete tag
            tokens.push(`${tag}>`);

            // Reset tag variables
            tag = '';
            tagIsOpen = false;
        } else if (tagIsOpen) {
            // Add char to tag
            tag = `${tag}${char}`;
        } else {
            // Add char to content
            content = `${content}${char}`;
        }
    });

    // No tags were found
    if (content.length) {
        tokens.push(content);
    }

    return tokens;
}

export function parseXML(xmlString) {
    try {
        const chars = xmlString.split('');

        // Create root of document tree
        const root = { value: null, children: [], parent: null };

        // Keep track of current node
        let currentNode = root;

        // Keep track of content
        let content = '';

        let index = 0;
        while (index < chars.length) {
            let char = chars[index];

            // Tag opened
            if (char === '<') {
                // Add content to current node
                if (content !== '') {
                    currentNode.children.push({
                        value: content,
                        children: [],
                        parent: currentNode,
                    });

                    // Reset
                    content = '';
                }

                // Peak next char
                const nextChar = chars[Math.min(chars.length - 1, index + 1)];

                // Close tag
                if (nextChar === '/') {
                    // Skip '/'
                    index = Math.min(chars.length - 1, index + 2);
                    char = chars[index];

                    // Get the tag name
                    let closeTagName = '';

                    while (char !== '>' && char !== '/') {
                        closeTagName = `${closeTagName}${char}`;
                        index += 1;
                        char = chars[index];
                    }

                    // Skip '>' or '/'
                    index += 1;

                    // Check the open and close tags match
                    if (closeTagName !== currentNode.value) {
                        throw Error(
                            `Open tag ${
                                currentNode.value
                            } does not match close tag ${closeTagName}`
                        );
                    }

                    // Move back to parent node
                    if (currentNode.parent) {
                        currentNode = currentNode.parent;
                    }

                    // Open tag
                } else {
                    // Get the tag name
                    let tagName = '';

                    index = Math.min(chars.length - 1, index + 1);
                    char = chars[index];

                    while (char !== '>' && char !== '/') {
                        tagName = `${tagName}${char}`;
                        index += 1;
                        char = chars[index];
                    }

                    // Skip '>' or '/'
                    index += 1;

                    // Add newNode to the tree
                    const newNode = {
                        value: tagName,
                        children: [],
                        parent: currentNode,
                    };

                    currentNode.children.push(newNode);

                    // newNode is now the current node if the tag is not self
                    // closing
                    if (chars[index - 1] !== '/' && chars[index] !== '>') {
                        currentNode = newNode;
                    } else {
                        // Handle self closing tag extra character
                        index += 1;
                    }
                }
                // Keep content
            } else {
                content = `${content}${char}`;
                index += 1;
            }
        }

        return root;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}
