//
//  GestureHandlerRegistry.h
//  GestureHandler
//
//  Created by Krzysztof Magiera on 12/10/2017.
//  Copyright © 2017 Software Mansion. All rights reserved.
//

#import "GestureHandler.h"

@interface GestureHandlerRegistry : NSObject

- (nullable GestureHandler *)handlerWithTag:(nonnull NSNumber *)handlerTag;
- (void)registerGestureHandler:(nonnull GestureHandler *)gestureHandler;
- (void)attachHandlerWithTag:(nonnull NSNumber *)handlerTag toView:(nonnull UIView *)view;
- (void)dropHandlerWithTag:(nonnull NSNumber *)handlerTag;
- (void)detachHandlerWithTag:(nonnull NSNumber *)handlerTag;
- (void)detachHandlerWithTag:(nonnull NSNumber *)handlerTag;

@end
