from datetime import datetime
from typing import List
from fastapi import APIRouter, File, UploadFile, status
from app.schemas.models import DocumentMetadata, DocumentUploadResponse

router = APIRouter()


@router.post(
    "/upload",
    response_model=DocumentUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a new business context document",
)
def upload_document(file: UploadFile = File(...)) -> DocumentUploadResponse:
    """
    Accepts document files (PDFs, Financials, CSVs) for database staging.
    Currently returns dummy metadata.
    """
    return DocumentUploadResponse(
        document_id="dummy-doc-uuid-67890",
        message=f"Document '{file.filename}' uploaded and indexed successfully.",
    )


@router.get(
    "/",
    response_model=List[DocumentMetadata],
    summary="List all uploaded document metadata",
)
def list_documents() -> List[DocumentMetadata]:
    """
    Retrieves metadata listings for all uploaded context documents.
    """
    return [
        DocumentMetadata(
            filename="market_research_2026.pdf",
            upload_date=datetime.utcnow(),
            type="PDF",
        ),
        DocumentMetadata(
            filename="q1_financials.csv",
            upload_date=datetime.utcnow(),
            type="CSV",
        ),
    ]
