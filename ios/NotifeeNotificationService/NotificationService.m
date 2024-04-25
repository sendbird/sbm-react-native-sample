//
//  NotificationService.m
//  NotifeeNotificationService
//
//  Created by Tyler Hammer on 1/11/24.
//

#import "NotificationService.h"
#import "NotifeeExtensionHelper.h"
#import "SendbirdNotificationHelper.h"

@interface NotificationService ()

@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;

@end

@implementation NotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
    self.contentHandler = contentHandler;
    self.bestAttemptContent = [request.content mutableCopy];
  
  NSLog(@"%@", request);
  NSLog(@"Logging Notification");
  
  [SendbirdNotificationHelper setAppGroup:@"group.sample.chat.react-native"];
  
  [SendbirdNotificationHelper markPushNotificationAsDelivered:self.bestAttemptContent.userInfo completionHandler:^(NSError * _Nullable error) {
        if (error != nil) NSLog(@"markPushNotificationAsDelivered error: %@", [error localizedDescription]);
        else NSLog(@"markPushNotificationAsDelivered success");
      }];
    
    // Modify the notification content here...
  [NotifeeExtensionHelper populateNotificationContent:request
                                  withContent: self.bestAttemptContent
                                  withContentHandler:contentHandler];
}

- (void)serviceExtensionTimeWillExpire {
    // Called just before the extension will be terminated by the system.
    // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
    self.contentHandler(self.bestAttemptContent);
}

@end
