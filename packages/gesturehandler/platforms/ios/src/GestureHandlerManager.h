#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@class GestureHandler;
@interface GestureHandlerManager : NSObject

- (nonnull instancetype)init;

- (GestureHandler*)createGestureHandler:(nonnull NSString *)handlerName
                         tag:(nonnull NSNumber *)handlerTag
                      config:(nonnull NSDictionary *)config;

- (void)attachGestureHandler:(nonnull NSNumber *)handlerTag
               toView:(nonnull UIView *)view;

- (void)updateGestureHandler:(nonnull NSNumber *)handlerTag config:(nonnull NSDictionary *)config;

- (void)dropGestureHandler:(nonnull NSNumber *)handlerTag;
- (void)registerGestureHandler:(nonnull GestureHandler *)gestureHandler;

//- (void)handleSetJSResponder:(nonnull UIView *)view
//        blockNativeResponder:(nonnull NSNumber *)blockNativeResponder;

//- (void)handleClearJSResponder;

@end
