param(
  [Parameter(Mandatory = $true)]
  [string]$InputPath,

  [Parameter(Mandatory = $true)]
  [string]$OutputPath
)

$ErrorActionPreference = "Stop"
$extension = [System.IO.Path]::GetExtension($InputPath).ToLowerInvariant()

function Release-ComObject {
  param([object]$ComObject)

  if ($null -ne $ComObject) {
    [void][System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($ComObject)
  }
}

if ($extension -in @(".ppt", ".pptx")) {
  $powerPoint = $null
  $presentation = $null

  try {
    $powerPoint = New-Object -ComObject PowerPoint.Application
    $powerPoint.DisplayAlerts = 1
    $presentation = $powerPoint.Presentations.Open($InputPath, $true, $false, $false)
    $presentation.SaveAs($OutputPath, 32)
  }
  finally {
    if ($null -ne $presentation) {
      $presentation.Close()
    }

    if ($null -ne $powerPoint) {
      $powerPoint.Quit()
    }

    Release-ComObject $presentation
    Release-ComObject $powerPoint
  }
}
elseif ($extension -in @(".doc", ".docx")) {
  $word = $null
  $document = $null

  try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $document = $word.Documents.Open($InputPath, $false, $true)
    $document.ExportAsFixedFormat($OutputPath, 17)
  }
  finally {
    if ($null -ne $document) {
      $document.Close($false)
    }

    if ($null -ne $word) {
      $word.Quit()
    }

    Release-ComObject $document
    Release-ComObject $word
  }
}
else {
  throw "Unsupported Office preview extension: $extension"
}

[GC]::Collect()
[GC]::WaitForPendingFinalizers()

if (-not (Test-Path -LiteralPath $OutputPath -PathType Leaf)) {
  throw "Office preview was not created"
}
