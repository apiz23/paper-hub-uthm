import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeBlockProps {
	language: string;
	codeString: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, codeString }) => {
	return (
		<>
			<SyntaxHighlighter language={language} style={oneDark}>
				{codeString}
			</SyntaxHighlighter>
		</>
	);
};

export default CodeBlock;
