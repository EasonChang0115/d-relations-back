import { Injectable } from '@nestjs/common';

/**
 * PDF Report Template Builder
 * Generates HTML templates for PDF conversion
 */
@Injectable()
export class PdfTemplateBuilder {
  /**
   * Build result report template
   */
  buildResultReportTemplate(reportData: any): string {
    const {
      userName,
      examType,
      totalQuestions,
      correctAnswers,
      score,
      completedAt,
      timeSpentSeconds,
      answers,
      answerDistribution,
    } = reportData;

    const timeSpent = this.formatTime(timeSpentSeconds || 0);
    const percentCorrect = ((correctAnswers / totalQuestions) * 100).toFixed(1);

    return `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>測驗報告</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .header {
      text-align: center;
      border-bottom: 2px solid #007bff;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    
    .header h1 {
      color: #007bff;
      font-size: 32px;
      margin-bottom: 10px;
    }
    
    .user-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      color: #666;
      font-size: 14px;
    }
    
    .score-section {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .score-card {
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    
    .score-card.alt {
      background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
    }
    
    .score-card.alt2 {
      background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
    }
    
    .score-card.alt3 {
      background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
    }
    
    .score-card .label {
      font-size: 12px;
      opacity: 0.9;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    
    .score-card .value {
      font-size: 28px;
      font-weight: bold;
    }
    
    .details-section {
      margin-bottom: 30px;
    }
    
    .section-title {
      font-size: 20px;
      color: #007bff;
      margin-bottom: 15px;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 10px;
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    
    .detail-item {
      padding: 12px;
      background: #f9f9f9;
      border-left: 4px solid #007bff;
    }
    
    .detail-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    
    .detail-value {
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }
    
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #999;
      font-size: 12px;
    }
    
    .footer-logo {
      font-weight: bold;
      color: #007bff;
      margin-bottom: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>醫學細胞識別能力測驗報告</h1>
      <div class="user-info">
        <div><strong>考生姓名:</strong> ${userName}</div>
        <div><strong>測驗日期:</strong> ${this.formatDate(completedAt)}</div>
      </div>
    </div>
    
    <div class="score-section">
      <div class="score-card">
        <div class="label">總分</div>
        <div class="value">${score.toFixed(1)}</div>
      </div>
      <div class="score-card alt">
        <div class="label">答對題數</div>
        <div class="value">${correctAnswers}/${totalQuestions}</div>
      </div>
      <div class="score-card alt2">
        <div class="label">答對率</div>
        <div class="value">${percentCorrect}%</div>
      </div>
      <div class="score-card alt3">
        <div class="label">耗時</div>
        <div class="value">${timeSpent}</div>
      </div>
    </div>
    
    <div class="details-section">
      <div class="section-title">測驗詳情</div>
      <div class="details-grid">
        <div class="detail-item">
          <div class="detail-label">測驗類型</div>
          <div class="detail-value">${examType === 'general' ? '普通組' : examType}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">題目數量</div>
          <div class="detail-value">${totalQuestions} 題</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">及格標準</div>
          <div class="detail-value">60 分以上</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">成績狀態</div>
          <div class="detail-value">${score >= 60 ? '✓ 通過' : '✗ 未通過'}</div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-logo">醫學細胞識別能力測驗平台</div>
      <div>© 2025 All Rights Reserved</div>
      <div>報告生成時間: ${new Date().toLocaleString('zh-TW')}</div>
    </div>
  </div>
</body>
</html>
    `;
  }

  private formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}小時 ${minutes}分 ${secs}秒`;
    } else if (minutes > 0) {
      return `${minutes}分 ${secs}秒`;
    } else {
      return `${secs}秒`;
    }
  }
}
