param(
  [Parameter(Mandatory = $true)]
  [string]$OutputRoot,

  [int]$CountPerGroup = 100
)

Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"

$groups = @(
  @{
    Id = "asian_women_daily_makeup"
    Label = "Synthetic Asian women daily makeup"
    Skin = @([System.Drawing.Color]::FromArgb(236, 198, 160), [System.Drawing.Color]::FromArgb(224, 180, 140), [System.Drawing.Color]::FromArgb(244, 207, 171))
    Hair = @([System.Drawing.Color]::FromArgb(35, 28, 24), [System.Drawing.Color]::FromArgb(48, 36, 30))
    Eye = @([System.Drawing.Color]::FromArgb(45, 33, 28), [System.Drawing.Color]::FromArgb(55, 40, 33))
    Lip = @([System.Drawing.Color]::FromArgb(172, 84, 86), [System.Drawing.Color]::FromArgb(190, 103, 100), [System.Drawing.Color]::FromArgb(154, 77, 82))
    Blush = @([System.Drawing.Color]::FromArgb(235, 142, 130), [System.Drawing.Color]::FromArgb(226, 122, 118))
  },
  @{
    Id = "white_women_daily_makeup"
    Label = "Synthetic white women daily makeup"
    Skin = @([System.Drawing.Color]::FromArgb(245, 205, 181), [System.Drawing.Color]::FromArgb(232, 185, 158), [System.Drawing.Color]::FromArgb(250, 220, 198))
    Hair = @([System.Drawing.Color]::FromArgb(92, 65, 44), [System.Drawing.Color]::FromArgb(176, 132, 76), [System.Drawing.Color]::FromArgb(50, 36, 28))
    Eye = @([System.Drawing.Color]::FromArgb(73, 110, 112), [System.Drawing.Color]::FromArgb(84, 67, 48), [System.Drawing.Color]::FromArgb(77, 100, 70))
    Lip = @([System.Drawing.Color]::FromArgb(184, 92, 102), [System.Drawing.Color]::FromArgb(197, 112, 116), [System.Drawing.Color]::FromArgb(160, 82, 95))
    Blush = @([System.Drawing.Color]::FromArgb(238, 136, 140), [System.Drawing.Color]::FromArgb(225, 125, 132))
  },
  @{
    Id = "black_women_daily_makeup"
    Label = "Synthetic black women daily makeup"
    Skin = @([System.Drawing.Color]::FromArgb(122, 72, 45), [System.Drawing.Color]::FromArgb(92, 55, 38), [System.Drawing.Color]::FromArgb(154, 93, 55))
    Hair = @([System.Drawing.Color]::FromArgb(25, 20, 18), [System.Drawing.Color]::FromArgb(39, 29, 24))
    Eye = @([System.Drawing.Color]::FromArgb(42, 28, 22), [System.Drawing.Color]::FromArgb(55, 37, 26))
    Lip = @([System.Drawing.Color]::FromArgb(140, 61, 75), [System.Drawing.Color]::FromArgb(165, 77, 89), [System.Drawing.Color]::FromArgb(118, 51, 67))
    Blush = @([System.Drawing.Color]::FromArgb(196, 92, 104), [System.Drawing.Color]::FromArgb(176, 77, 96))
  }
)

function Pick($items, [int]$index, [int]$salt) {
  return $items[($index + $salt) % $items.Count]
}

function New-Brush([System.Drawing.Color]$color) {
  return New-Object System.Drawing.SolidBrush($color)
}

function New-Pen([System.Drawing.Color]$color, [float]$width) {
  return New-Object System.Drawing.Pen($color, $width)
}

function Draw-SyntheticFace($path, $group, [int]$index) {
  $width = 512
  $height = 512
  $bitmap = New-Object System.Drawing.Bitmap($width, $height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

  $bgColor = [System.Drawing.Color]::FromArgb(248, 244, 238)
  $graphics.Clear($bgColor)

  $skin = Pick $group.Skin $index 1
  $hair = Pick $group.Hair $index 2
  $eye = Pick $group.Eye $index 3
  $lip = Pick $group.Lip $index 4
  $blush = Pick $group.Blush $index 5

  $faceX = 146 + (($index % 5) - 2) * 3
  $faceY = 88 + (($index % 7) - 3) * 2
  $faceW = 220 + (($index % 4) * 4)
  $faceH = 300 + (($index % 6) * 3)

  $hairBrush = New-Brush $hair
  $skinBrush = New-Brush $skin
  $eyeBrush = New-Brush $eye
  $lipBrush = New-Brush $lip
  $blushBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(70, $blush.R, $blush.G, $blush.B))
  $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(42, 88, 61, 48))
  $highlightBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(70, 255, 242, 218))

  $graphics.FillEllipse($hairBrush, $faceX - 22, $faceY - 54, $faceW + 44, $faceH + 92)
  $graphics.FillEllipse($skinBrush, $faceX, $faceY, $faceW, $faceH)

  $graphics.FillRectangle($hairBrush, $faceX + 10, $faceY - 22, $faceW - 20, 74)
  $graphics.FillEllipse($hairBrush, $faceX - 26, $faceY + 38, 62, 210)
  $graphics.FillEllipse($hairBrush, $faceX + $faceW - 36, $faceY + 38, 62, 210)

  $eyeY = $faceY + 132 + (($index % 3) - 1) * 2
  $leftEyeX = $faceX + 62
  $rightEyeX = $faceX + $faceW - 92
  $eyeW = 34 + ($index % 3)
  $eyeH = 13 + ($index % 2)

  $linerPen = New-Pen ([System.Drawing.Color]::FromArgb(70, 44, 36)) 3
  $graphics.DrawArc($linerPen, $leftEyeX, $eyeY, $eyeW, $eyeH, 190, 160)
  $graphics.DrawArc($linerPen, $rightEyeX, $eyeY, $eyeW, $eyeH, 190, 160)
  $graphics.FillEllipse($eyeBrush, $leftEyeX + 11, $eyeY + 2, 8, 8)
  $graphics.FillEllipse($eyeBrush, $rightEyeX + 11, $eyeY + 2, 8, 8)

  $browPen = New-Pen ([System.Drawing.Color]::FromArgb(90, $hair.R, $hair.G, $hair.B)) 4
  $graphics.DrawArc($browPen, $leftEyeX - 3, $eyeY - 26, 46, 18, 195, 135)
  $graphics.DrawArc($browPen, $rightEyeX - 3, $eyeY - 26, 46, 18, 195, 135)

  $nosePen = New-Pen ([System.Drawing.Color]::FromArgb(55, 116, 78, 57)) 2
  $noseX = $faceX + [int]($faceW / 2)
  $graphics.DrawArc($nosePen, $noseX - 15, $eyeY + 34, 30, 58, 78, 112)

  $graphics.FillEllipse($blushBrush, $faceX + 38, $faceY + 184, 58, 30)
  $graphics.FillEllipse($blushBrush, $faceX + $faceW - 96, $faceY + 184, 58, 30)
  $graphics.FillEllipse($highlightBrush, $faceX + 68, $faceY + 82, 26, 70)
  $graphics.FillEllipse($shadowBrush, $faceX + 26, $faceY + 200, 24, 88)
  $graphics.FillEllipse($shadowBrush, $faceX + $faceW - 50, $faceY + 200, 24, 88)

  $lipY = $faceY + 234 + (($index % 5) - 2)
  $lipX = $noseX - 40
  $graphics.FillEllipse($lipBrush, $lipX, $lipY, 80, 20)
  $graphics.FillEllipse((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(160, $lip.R, $lip.G, $lip.B))), $lipX + 10, $lipY + 10, 60, 17)

  $labelBrush = New-Brush ([System.Drawing.Color]::FromArgb(115, 103, 92))
  $font = New-Object System.Drawing.Font("Segoe UI", 9)
  $graphics.DrawString("synthetic daily makeup fixture", $font, $labelBrush, 18, 480)

  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)

  $font.Dispose()
  $hairBrush.Dispose()
  $skinBrush.Dispose()
  $eyeBrush.Dispose()
  $lipBrush.Dispose()
  $blushBrush.Dispose()
  $shadowBrush.Dispose()
  $highlightBrush.Dispose()
  $linerPen.Dispose()
  $browPen.Dispose()
  $nosePen.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

$datasetRoot = Join-Path $OutputRoot "synthetic_daily_makeup"
New-Item -ItemType Directory -Force -Path $datasetRoot | Out-Null

$manifestRows = New-Object System.Collections.Generic.List[object]

foreach ($group in $groups) {
  $groupDir = Join-Path $datasetRoot $group.Id
  New-Item -ItemType Directory -Force -Path $groupDir | Out-Null

  for ($i = 1; $i -le $CountPerGroup; $i++) {
    $fileName = "{0}_{1:D3}.png" -f $group.Id, $i
    $path = Join-Path $groupDir $fileName
    Draw-SyntheticFace $path $group $i
    $manifestRows.Add([PSCustomObject]@{
      file = $fileName
      relativePath = "synthetic_daily_makeup/$($group.Id)/$fileName"
      group = $group.Id
      label = $group.Label
      source = "procedural_synthetic"
      realPerson = $false
      makeupStyle = "daily_common_makeup"
    }) | Out-Null
  }
}

$manifestJson = Join-Path $datasetRoot "manifest.json"
$manifestRows | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $manifestJson -Encoding UTF8

$manifestCsv = Join-Path $datasetRoot "manifest.csv"
$manifestRows | Export-Csv -LiteralPath $manifestCsv -NoTypeInformation -Encoding UTF8

$readme = @"
# Synthetic Daily Makeup Face Dataset

This dataset contains procedurally generated synthetic face fixtures.

Important:

- These are not real people.
- These are not downloaded photos.
- These should be used only for local Makeup Engine testing.
- Group folders are synthetic appearance fixtures, not identity labels.

Groups:

- asian_women_daily_makeup: 100 images
- white_women_daily_makeup: 100 images
- black_women_daily_makeup: 100 images

Use cases:

- UI testing
- local pipeline testing
- makeup recommendation fixture testing
- non-biometric synthetic development data
"@

Set-Content -LiteralPath (Join-Path $datasetRoot "README.md") -Value $readme -Encoding UTF8

Write-Output "Created synthetic dataset at: $datasetRoot"
Write-Output "Total images: $($groups.Count * $CountPerGroup)"
