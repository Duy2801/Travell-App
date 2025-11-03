# Script để kill process đang dùng port 3000
Write-Host "Đang tìm process sử dụng port 3000..." -ForegroundColor Yellow

$port = 3000
$processId = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess

if ($processId) {
    Write-Host "Tìm thấy process ID: $processId" -ForegroundColor Cyan
    try {
        Stop-Process -Id $processId -Force
        Write-Host "✅ Đã kill process thành công!" -ForegroundColor Green
        Start-Sleep -Seconds 1
    }
    catch {
        Write-Host "❌ Lỗi khi kill process: $_" -ForegroundColor Red
    }
}
else {
    Write-Host "✅ Port 3000 đang trống, sẵn sàng sử dụng!" -ForegroundColor Green
}
