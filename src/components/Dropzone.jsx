import React, { useState } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import mammoth from 'mammoth'; 

const useStyles = makeStyles(theme => createStyles({
    previewChip: {
        minWidth: 160,
        maxWidth: 210
    },
    docxContent: {
        marginTop: 20,
        padding: 20,
        border: '1px solid #ccc',
        borderRadius: 4,
        backgroundColor: '#f9f9f9',
        whiteSpace: 'pre-wrap',
    },
}));

const DocxViewer = ({ content }) => {
    const classes = useStyles();
    return (
        <div className={classes.docxContent} dangerouslySetInnerHTML={{ __html: content }} />
    );
};

export default function Dropzone() {
    const classes = useStyles();
    const [docxContent, setDocxContent] = useState('');

    const handleDrop = async ([file]) => {
        if (file && file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const reader = new FileReader();
            reader.onload = async function(e) {
                const arrayBuffer = e.target.result;
                const result = await mammoth.convertToHtml({ arrayBuffer });
                setDocxContent(result.value);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleDownload = () => {
        const element = document.createElement('a');
        const file = new Blob([docxContent], {type: 'text/html'});
        element.href = URL.createObjectURL(file);
        element.download = 'converted_document.html';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div>
            <DropzoneArea
                showPreviews={true}
                showPreviewsInDropzone={false}
                useChipsForPreview
                previewGridProps={{container: { spacing: 1, direction: 'row' }}}
                previewChipProps={{classes: { root: classes.previewChip } }}
                previewText="Selected files"
                onChange={(files) => console.log('Files:', files)}
                onDrop={handleDrop}
            />
            {docxContent && (
                <>
                    <button onClick={handleDownload}>Download HTML</button>
                    <DocxViewer content={docxContent} /> 
                </>
            )}
        </div>
    );
}
