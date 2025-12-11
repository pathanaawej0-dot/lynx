'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

export default function MermaidDiagram({ chart }) {
    const ref = useRef(null);
    const [svg, setSvg] = useState('');

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'dark',
            themeVariables: {
                darkMode: true,
                background: '#1C1B1F',
                primaryColor: '#D0BCFF',
                primaryBorderColor: '#D0BCFF',
                lineColor: '#CAC4D0',
                textColor: '#E6E1E5',
            }
        });

        const render = async () => {
            if (ref.current && chart) {
                try {
                    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                    const { svg } = await mermaid.render(id, chart);
                    setSvg(svg);
                } catch (error) {
                    console.error('Mermaid render error:', error);
                    setSvg('<div class="text-error p-4 border border-error rounded">Failed to render diagram</div>');
                }
            }
        };

        render();
    }, [chart]);

    return (
        <div
            ref={ref}
            className="my-6 p-6 bg-surface-container-high rounded-xl overflow-x-auto flex justify-center w-full"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
