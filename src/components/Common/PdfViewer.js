import React, { useState, memo, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs";

const PdfViewer = memo(({ pdfFilePath }) => {

    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };


    return (
        <>
            <Document
                file={pdfFilePath}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(error) => console.error("Error loading PDF:", error)}
            >
                <Page pageNumber={pageNumber} />
            </Document>

            <p style={{ textAlign: 'center' }}>Page {pageNumber} of {numPages}</p>
            <div className='prev-next-section align-center'>
                <button className="secondary-btn" disabled={pageNumber <= 1} onClick={() => setPageNumber(pageNumber - 1)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="#FFF"
                            d="M12.707 17.293L8.414 13H18v-2H8.414l4.293-4.293l-1.414-1.414L4.586 12l6.707 6.707z"
                        />
                    </svg>
                    Previous
                </button>
                <button className="secondary-btn" disabled={pageNumber >= numPages} onClick={() => setPageNumber(pageNumber + 1)}>
                    Next
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="#FFF"
                            d="M11.293 6.707L15.586 11H6v2h9.586l-4.293 4.293l1.414 1.414L19.414 12l-6.707-6.707z"
                        />
                    </svg>
                </button>
            </div>
        </>
    );
});

export default PdfViewer;
