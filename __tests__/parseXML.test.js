import { tokenize, parseXML } from '../parseXML';

describe('Tokenize XML', () => {
    test('tokenize should be a function', () => {
        expect(tokenize).toBeInstanceOf(Function);
    });

    test('Parse "<a>bla</a><b><c>yes</c>one</b>"', () => {
        const answer = [
            '<a>',
            'bla',
            '</a>',
            '<b>',
            '<c>',
            'yes',
            '</c>',
            'one',
            '</b>',
        ];
        const tokens = tokenize('<a>bla</a><b><c>yes</c>one</b>');

        expect(tokens).toEqual(answer);
    });

    test('Parse "This is a string"', () => {
        const answer = ['This is a string'];

        const tokens = tokenize('This is a string');

        expect(tokens).toEqual(answer);
    });

    test('Parse "<br/>"', () => {
        const answer = ['<br/>'];

        const tokens = tokenize('<br/>');

        expect(tokens).toEqual(answer);
    });

    test('Parse empty string', () => {
        const answer = [];

        const tokens = tokenize('');

        expect(tokens).toEqual(answer);
    });
});

describe('Build XML tree', () => {
    test('parseXML, should be a function', () => {
        expect(parseXML).toBeInstanceOf(Function);
    });

    test('Parse empty string', () => {
        const answer = {
            value: null,
            children: [],
            parent: null,
        };

        const tree = parseXML('');

        expect(tree).toEqual(answer);
    });

    test('Build tree "<a>bla</a><b><c>yes one</c><br/></b><br/>"', () => {
        const answer = {
            value: null,
            children: [
                {
                    value: 'a',
                    children: [
                        {
                            value: 'bla',
                            children: [],
                            parent: null,
                        },
                    ],
                    parent: null,
                },
                {
                    value: 'b',
                    children: [
                        {
                            value: 'c',
                            children: [
                                {
                                    value: 'yes one',
                                    children: [],
                                    parent: null,
                                },
                            ],
                            parent: null,
                        },
                        {
                            value: 'br',
                            children: [],
                            parent: null,
                        },
                    ],
                    parent: null,
                },
                {
                    value: 'br',
                    children: [],
                    parent: null,
                },
            ],
            parent: null,
        };

        // Add parent references
        answer.children[0].parent = answer;
        answer.children[1].parent = answer;
        answer.children[2].parent = answer;

        // a parent reference
        answer.children[0].children[0].parent = answer.children[0];

        // b parent references
        answer.children[1].children[0].parent = answer.children[1];
        answer.children[1].children[1].parent = answer.children[1];

        // c parent reference
        answer.children[1].children[0].children[0].parent =
            answer.children[1].children[0];

        const tree = parseXML('<a>bla</a><b><c>yes one</c><br/></b><br/>');

        expect(tree).toEqual(answer);
    });

    test('Tag nesting is incorrect <a>bla</a><b>yes<c>one</c><d></b></d>"', () => {
        expect(() => {
            const tree = parseXML('<a>bla</a><b>yes<c>one</c><d></b></d>');
        }).toThrow();
    });

    test('Open and close tags do not match <a>bla</a><b></c>"', () => {
        expect(() => {
            const tree = parseXML('<a>bla</a><b></c>');
        }).toThrow();
    });
});
