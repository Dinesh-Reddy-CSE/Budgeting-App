// client/src/services/notificationsService.js
// This will handle frontend notifications
// Backend notifications (email/push) will be implemented later

export const showNotification = (message, type = 'info') => {
  // Remove any existing notifications
  const existingNotifications = document.querySelectorAll('.notification-system');
  existingNotifications.forEach(notification => {
    notification.remove();
  });

  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification notification-system show';
  notification.classList.add(type);
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateX(0);
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
    ${type === 'success' ? 'background-color: var(--success-color);' : ''}
    ${type === 'error' ? 'background-color: var(--danger-color);' : ''}
    ${type === 'warning' ? 'background-color: var(--warning-color); color: #212529;' : ''}
    ${type === 'info' ? 'background-color: var(--info-color);' : ''}
  `;

  notification.textContent = message;
  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
};

// Check for overspending
export const checkOverspending = async (categoryId, amount, budgetService) => {
  try {
    // Get current month/year
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Get all budgets for current month
    const budgetResponse = await budgetService.getBudgets({ month, year });
    
    // Find budget for this category
    const categoryBudget = budgetResponse.budgets.find(
      budget => budget.category === categoryId
    );

    if (categoryBudget) {
      // Get total spent in this category for current month
      // This would require a new backend endpoint or calculation
      // For now, we'll simulate with a simple check
      const currentSpent = amount; // This is simplified
      
      if (currentSpent > categoryBudget.amount) {
        showNotification(
          `⚠️ Overspending Alert: You've exceeded your ${categoryId} budget of $${categoryBudget.amount}! Current spending: $${currentSpent.toFixed(2)}`,
          'warning'
        );
      } else if (currentSpent > categoryBudget.amount * 0.8) {
        showNotification(
          `💡 Budget Alert: You're approaching your ${categoryId} budget limit ($${categoryBudget.amount}). Current spending: $${currentSpent.toFixed(2)}`,
          'info'
        );
      }
    }
  } catch (error) {
    console.log('Could not check budget limits:', error);
  }
};